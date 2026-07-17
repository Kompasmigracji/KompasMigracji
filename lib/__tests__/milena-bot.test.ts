/**
 * Unit tests for lib/milena-bot.ts
 */

import {
  matchIntents,
  isMultiIntent,
  getMissingFields,
  getFlowMeta,
  withFlowMeta,
  fieldLabel,
  shouldEscalate,
  type Intent,
} from '../milena-bot';

function makeIntent(serviceId: string, label: string, phrases: string[]): Intent {
  return { id: `intent-${label}`, service_id: serviceId, stage: 'Перше звернення', intent_label: label, trigger_phrases: phrases };
}

describe('matchIntents', () => {
  const intents: Intent[] = [
    makeIntent('svc-residence', 'Карта побиту', ['карта побиту', 'дозвіл на проживання']),
    makeIntent('svc-poa', 'Довіреність', ['довіреність', 'pełnomocnictwo']),
  ];

  it('returns no matches when nothing in the message hits a trigger phrase', () => {
    expect(matchIntents('Доброго дня, як у вас справи?', intents)).toEqual([]);
  });

  it('matches a single service when only one topic is mentioned', () => {
    const matches = matchIntents('Скільки коштує карта побиту?', intents);
    expect(matches).toHaveLength(1);
    expect(matches[0].serviceId).toBe('svc-residence');
  });

  it('is case-insensitive', () => {
    const matches = matchIntents('КАРТА ПОБИТУ терміново', intents);
    expect(matches).toHaveLength(1);
    expect(matches[0].serviceId).toBe('svc-residence');
  });

  it('matches multiple distinct services when the message mentions both', () => {
    const matches = matchIntents('Питаю про карту побиту і довіреність', intents);
    const serviceIds = matches.map((m) => m.serviceId).sort();
    expect(serviceIds).toEqual(['svc-poa', 'svc-residence']);
  });

  it('picks the higher-scoring intent within the same service when multiple phrases match', () => {
    const twoIntentsSameService: Intent[] = [
      makeIntent('svc-residence', 'Коротке', ['карта']),
      makeIntent('svc-residence', 'Довге', ['карта побиту через роботу']),
    ];
    const matches = matchIntents('Хочу карта побиту через роботу оформити', twoIntentsSameService);
    expect(matches).toHaveLength(1);
    expect(matches[0].intent.intent_label).toBe('Довге');
  });
});

describe('isMultiIntent', () => {
  it('is false for zero or one matched service', () => {
    expect(isMultiIntent([])).toBe(false);
    expect(isMultiIntent([{ serviceId: 'a', intent: makeIntent('a', 'x', ['x']), score: 1 }])).toBe(false);
  });

  it('is true when matches span two distinct services', () => {
    const matches = [
      { serviceId: 'a', intent: makeIntent('a', 'x', ['x']), score: 1 },
      { serviceId: 'b', intent: makeIntent('b', 'y', ['y']), score: 1 },
    ];
    expect(isMultiIntent(matches)).toBe(true);
  });

  it('is false when the same service matched twice (not two distinct services)', () => {
    const matches = [
      { serviceId: 'a', intent: makeIntent('a', 'x', ['x']), score: 1 },
      { serviceId: 'a', intent: makeIntent('a', 'x2', ['x2']), score: 2 },
    ];
    expect(isMultiIntent(matches)).toBe(false);
  });
});

describe('getMissingFields', () => {
  it('returns fields absent from context', () => {
    expect(getMissingFields(['phone_pl', 'email'], {})).toEqual(['phone_pl', 'email']);
  });

  it('excludes fields already present with a non-empty value', () => {
    expect(getMissingFields(['phone_pl', 'email'], { phone_pl: '+48123456789' })).toEqual(['email']);
  });

  it('treats null and empty-string values as still missing', () => {
    expect(getMissingFields(['phone_pl'], { phone_pl: null })).toEqual(['phone_pl']);
    expect(getMissingFields(['phone_pl'], { phone_pl: '' })).toEqual(['phone_pl']);
  });

  it('ignores the internal _flow_meta bookkeeping key', () => {
    expect(getMissingFields(['phone_pl'], { _flow_meta: { topic_clarify_count: 1 } })).toEqual(['phone_pl']);
  });
});

describe('getFlowMeta / withFlowMeta', () => {
  it('returns an empty object when no _flow_meta is present', () => {
    expect(getFlowMeta({})).toEqual({});
  });

  it('merges a patch into existing flow meta without touching other context fields', () => {
    const ctx = withFlowMeta({ phone_pl: '+48123456789' }, { topic_clarify_count: 1 });
    expect(ctx.phone_pl).toBe('+48123456789');
    expect(getFlowMeta(ctx)).toEqual({ topic_clarify_count: 1 });

    const ctx2 = withFlowMeta(ctx, { awaiting_field: 'email' });
    expect(getFlowMeta(ctx2)).toEqual({ topic_clarify_count: 1, awaiting_field: 'email' });
  });
});

describe('fieldLabel', () => {
  it('translates known field names to Ukrainian prompts', () => {
    expect(fieldLabel('phone_pl')).toBe('ваш номер телефону');
  });

  it('falls back to the raw field name for unknown fields', () => {
    expect(fieldLabel('some_unknown_field')).toBe('some_unknown_field');
  });
});

describe('shouldEscalate — the core safety gate', () => {
  it('escalates any card that is not status=actual, regardless of handoff_condition', () => {
    expect(shouldEscalate({ status: 'needs_legal_review' }, 'звичайне питання')).toBe(true);
    expect(shouldEscalate({ status: 'needs_update' }, 'звичайне питання')).toBe(true);
    expect(shouldEscalate({ status: 'do_not_use' }, 'звичайне питання')).toBe(true);
    expect(shouldEscalate({ status: 'historical' }, 'звичайне питання')).toBe(true);
  });

  it('does not escalate an actual card with no matching handoff_condition', () => {
    expect(shouldEscalate({ status: 'actual', handoff_condition: ['спір між сторонами'] }, 'скільки коштує')).toBe(false);
  });

  it('escalates an actual card when the message matches a handoff_condition', () => {
    expect(shouldEscalate({ status: 'actual', handoff_condition: ['спадкова справа'] }, 'це спадкова справа')).toBe(true);
  });

  it('handles a missing handoff_condition array gracefully', () => {
    expect(shouldEscalate({ status: 'actual' }, 'будь-яке повідомлення')).toBe(false);
  });
});
