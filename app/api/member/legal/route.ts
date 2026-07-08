import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req) {
  try {
    // Attempt to fetch from Supabase if configured
    const supabase = getSupabaseAdmin();
    // Assuming member ID is somehow passed or auth is working. We will just use mock data for the demo.
    
    // Mock Legal Cases data for Member Dashboard
    const mockCases = [
      {
        id: "case-101",
        case_type: "Karta Pobytu (Zezwolenie na pobyt czasowy)",
        status: "W toku",
        submission_date: "2026-05-15",
        expected_decision_date: "2026-09-15",
        urgency_level: "Normal",
        progress: 60, // UI specific helper
        steps: [
          { id: "step-1", step_name: "Złożenie wniosku", step_status: "Completed", step_date: "2026-05-15" },
          { id: "step-2", step_name: "Odciski palców", step_status: "Completed", step_date: "2026-06-20" },
          { id: "step-3", step_name: "Weryfikacja dokumentów", step_status: "In Progress", step_date: null },
          { id: "step-4", step_name: "Wydanie decyzji", step_status: "Pending", step_date: null }
        ],
        missing_documents: [
          "Załącznik nr 1 (podpisany przez pracodawcę)",
          "Umowa najmu mieszkania (aktualna)"
        ],
        ai_warning: "Ваша поточна віза закінчується через 45 днів. Рекомендуємо якнайшвидше донести до Ужонду договір оренди, щоб не затягувати розгляд справи."
      },
      {
        id: "case-102",
        case_type: "Oświadczenie o powierzeniu wykonywania pracy",
        status: "Decyzja pozytywna",
        submission_date: "2026-01-10",
        expected_decision_date: "2026-01-17",
        urgency_level: "Normal",
        progress: 100,
        steps: [
          { id: "step-10", step_name: "Wysłanie wniosku przez pracodawcę", step_status: "Completed", step_date: "2026-01-10" },
          { id: "step-11", step_name: "Rejestracja w PUP", step_status: "Completed", step_date: "2026-01-15" }
        ],
        missing_documents: [],
        ai_warning: null
      }
    ];

    return NextResponse.json({ cases: mockCases }, { status: 200 });

  } catch (error) {
    console.error("Error fetching legal cases:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
