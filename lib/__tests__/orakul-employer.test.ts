/**
 * Unit tests for lib/orakul-employer.ts
 */

import {
  extractTaggedJson,
  extractEmployerJson,
  extractHandoffReason,
  buildEmployerSituation,
  isCrossSellFlagged,
  checkDeterministicHandoffTriggers,
  hasAdBlockAlreadyShown,
  EMPLOYER_SENTINEL,
  EMPLOYER_AD_BLOCK_OPEN,
  EMPLOYER_AD_BLOCK_CLOSE,
} from '../orakul-employer';

describe('extractTaggedJson / extractEmployerJson', () => {
  it('extracts a well-formed JSON object after the tag', () => {
    const text = `Дякую!\n${EMPLOYER_SENTINEL}\n{"company_name":"Acme","positions_needed":"5 spawaczy"}`;
    expect(extractEmployerJson(text)).toEqual({ company_name: 'Acme', positions_needed: '5 spawaczy' });
  });

  it('returns null when the tag is absent', () => {
    expect(extractEmployerJson('Дякую, гарного дня!')).toBeNull();
  });

  it('returns null when the JSON after the tag is malformed', () => {
    const text = `${EMPLOYER_SENTINEL}\n{"company_name": "Acme",`;
    expect(extractEmployerJson(text)).toBeNull();
  });

  it('returns null when there is no JSON-looking content after the tag', () => {
    const text = `${EMPLOYER_SENTINEL}\nдякую за звернення`;
    expect(extractEmployerJson(text)).toBeNull();
  });

  it('works with an arbitrary tag via extractTaggedJson', () => {
    const text = `[ХХ]\n{"a":1}`;
    expect(extractTaggedJson(text, '[ХХ]')).toEqual({ a: 1 });
  });
});

describe('extractHandoffReason', () => {
  it('extracts the reason inside the handoff sentinel', () => {
    expect(extractHandoffReason('текст [ЛЮДИНА_ПОТРІБНА: 25 спеціалістів одночасно]')).toBe('25 спеціалістів одночасно');
  });

  it('falls back to a placeholder when no reason text is given', () => {
    expect(extractHandoffReason('текст [ЛЮДИНА_ПОТРІБНА:]')).toBe('не вказано');
  });

  it('returns null when the sentinel is absent', () => {
    expect(extractHandoffReason('звичайна відповідь без тегів')).toBeNull();
  });
});

describe('isCrossSellFlagged', () => {
  it('is true only when residence_card_docs_not_provided is exactly true', () => {
    expect(isCrossSellFlagged({ residence_card_docs_not_provided: true })).toBe(true);
    expect(isCrossSellFlagged({ residence_card_docs_not_provided: false })).toBe(false);
    expect(isCrossSellFlagged({})).toBe(false);
  });
});

describe('buildEmployerSituation', () => {
  it('renders known fields in a fixed, readable order', () => {
    const out = buildEmployerSituation({ company_name: 'Acme', positions_needed: '5 spawaczy', rate: '45 zł/h' });
    expect(out).toContain('назва компанії: Acme');
    expect(out).toContain('потрібні спеціалісти: 5 spawaczy');
    expect(out).toContain('ставка: 45 zł/h');
  });

  it('renders booleans as так/ні', () => {
    const out = buildEmployerSituation({ night_shifts: true, drawing_reading_required: false });
    expect(out).toContain('нічні зміни: так');
    expect(out).toContain('читання технічних рисунків: ні');
  });

  it('skips fields that are undefined but keeps fields with empty string as —', () => {
    const out = buildEmployerSituation({ housing: '' });
    expect(out).toContain('житло: —');
    expect(out).not.toContain('NIP');
  });

  it('prepends a cross-sell warning line when residence_card_docs_not_provided is true', () => {
    const out = buildEmployerSituation({ residence_card_docs_not_provided: true, company_name: 'Acme' });
    expect(out).toContain('КРОС-СЕЛЛ');
    expect(out.indexOf('КРОС-СЕЛЛ')).toBeLessThan(out.indexOf('назва компанії'));
  });

  it('does not prepend the cross-sell line when the flag is false or absent', () => {
    expect(buildEmployerSituation({ residence_card_docs_not_provided: false })).not.toContain('КРОС-СЕЛЛ');
    expect(buildEmployerSituation({})).not.toContain('КРОС-СЕЛЛ');
  });
});

describe('checkDeterministicHandoffTriggers — worker count band', () => {
  it('triggers on 25+ welders phrased in Polish', () => {
    const r = checkDeterministicHandoffTriggers('Dzień dobry, potrzebuję 25 spawaczy na budowę.');
    expect(r.handoff).toBe(true);
    expect(r.reason).toMatch(/25/);
  });

  it('triggers on 30+ welders phrased in English', () => {
    const r = checkDeterministicHandoffTriggers('We need 30 welders starting next month.');
    expect(r.handoff).toBe(true);
  });

  it('triggers on 22 people phrased in Ukrainian', () => {
    const r = checkDeterministicHandoffTriggers('Нам треба 22 людини на завод у Вроцлаві.');
    expect(r.handoff).toBe(true);
  });

  it('does not trigger for a small headcount', () => {
    const r = checkDeterministicHandoffTriggers('Шукаємо 3 зварювальників, ставка 45 zł/h.');
    expect(r.handoff).toBe(false);
  });

  it('does not trigger on "20 років досвіду" (years of experience, not headcount)', () => {
    const r = checkDeterministicHandoffTriggers('У мене 20 років досвіду в зварюванні.');
    expect(r.handoff).toBe(false);
  });

  it('does not trigger on "25 years" experience phrased in English', () => {
    const r = checkDeterministicHandoffTriggers('I have 25 years of experience as a foreman.');
    expect(r.handoff).toBe(false);
  });
});

describe('checkDeterministicHandoffTriggers — rate band (20-120 zł/h)', () => {
  it('triggers on an atypically low rate', () => {
    const r = checkDeterministicHandoffTriggers('Oferujemy 10 zł/h dla spawacza.');
    expect(r.handoff).toBe(true);
    expect(r.reason).toMatch(/низька/);
  });

  it('triggers on an atypically high rate', () => {
    const r = checkDeterministicHandoffTriggers('Płacimy 200 zł/h.');
    expect(r.handoff).toBe(true);
    expect(r.reason).toMatch(/висока/);
  });

  it('triggers on a range whose lower bound is too low', () => {
    const r = checkDeterministicHandoffTriggers('Stawka to 15-40 zł/godz.');
    expect(r.handoff).toBe(true);
  });

  it('does not trigger for a normal rate range', () => {
    const r = checkDeterministicHandoffTriggers('Ставка 40-45 zł/год, 3 spawaczy.');
    expect(r.handoff).toBe(false);
  });

  it('does not trigger on a plain small headcount + normal rate together', () => {
    const r = checkDeterministicHandoffTriggers('3 spawaczy, 45 zł/h.');
    expect(r.handoff).toBe(false);
  });
});

describe('hasAdBlockAlreadyShown', () => {
  it('is false for an empty history', () => {
    expect(hasAdBlockAlreadyShown([])).toBe(false);
  });

  it('is false when no assistant message contains the ad block', () => {
    const history = [
      { role: 'user', content: 'Привіт' },
      { role: 'assistant', content: 'Скільки спеціалістів вам потрібно?' },
    ];
    expect(hasAdBlockAlreadyShown(history)).toBe(false);
  });

  it('is true when a prior assistant message contains the opening ad block (uk)', () => {
    const history = [
      { role: 'assistant', content: `Опишіть кого шукаєте. ${EMPLOYER_AD_BLOCK_OPEN.uk}` },
    ];
    expect(hasAdBlockAlreadyShown(history)).toBe(true);
  });

  it('is true when a prior assistant message contains the closing ad block (en)', () => {
    const history = [
      { role: 'assistant', content: `Thanks! ${EMPLOYER_AD_BLOCK_CLOSE.en}` },
    ];
    expect(hasAdBlockAlreadyShown(history)).toBe(true);
  });

  it('ignores user messages even if they happen to contain the block text', () => {
    const history = [
      { role: 'user', content: EMPLOYER_AD_BLOCK_OPEN.pl },
    ];
    expect(hasAdBlockAlreadyShown(history)).toBe(false);
  });
});
