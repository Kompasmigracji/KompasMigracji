import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req) {
  try {
    // Attempt to fetch from Supabase if configured
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    const { data, error } = await supabase.from('kompas_legal_cases_v2').select('*');
    if (error) {
      console.error('Supabase legal error:', error);
    }
    
    // Map DB cases to UI format
    const dbCases = data || [];
    const mappedCases = dbCases.map(c => ({
        id: c.id,
        case_type: c.case_type,
        status: c.status,
        submission_date: c.created_at?.split('T')[0] || "2026-05-15",
        expected_decision_date: c.deadline,
        urgency_level: "Normal",
        progress: c.status === 'blocked' ? 30 : 60,
        steps: [
          { id: "step-1", step_name: "Złożenie wniosku", step_status: "Completed", step_date: c.created_at?.split('T')[0] },
          { id: "step-2", step_name: c.current_stage || "Odciski palców", step_status: c.status === 'blocked' ? "Pending" : "In Progress", step_date: null }
        ],
        missing_documents: c.status === 'blocked' ? [c.notes] : [],
        ai_warning: c.status === 'blocked' ? "Справа призупинена. Будь ласка, зверніть увагу на відсутні документи." : null
    }));

    // If DB is empty, fallback to a dummy array
    if (mappedCases.length === 0) {
       mappedCases.push({
        id: "case-101",
        case_type: "Karta Pobytu (Zezwolenie na pobyt czasowy)",
        status: "W toku",
        submission_date: "2026-05-15",
        expected_decision_date: "2026-09-15",
        urgency_level: "Normal",
        progress: 60,
        steps: [
          { id: "step-1", step_name: "Złożenie wniosku", step_status: "Completed", step_date: "2026-05-15" }
        ],
        missing_documents: [],
        ai_warning: null
       });
    }

    return NextResponse.json({ cases: mappedCases }, { status: 200 });

  } catch (error) {
    console.error("Error fetching legal cases:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
