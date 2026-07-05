import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    // Fetch total leads
    const { count: leadsCount, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (leadsError) throw leadsError;

    // Fetch active orders
    const { count: activeOrdersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'выполнено')
      .neq('status', 'отменено');

    if (ordersError) throw ordersError;

    // Fetch successful deals (completed orders)
    const { count: successDealsCount, error: successError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'выполнено');

    if (successError) throw successError;

    // Fetch total revenue
    // Calculate from sum of completed orders or just all orders
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'выполнено');

    if (revenueError) throw revenueError;
    
    const totalRevenue = revenueData.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

    // Dynamic Chart Data (mocked months, but using real logic if available)
    // Here we can aggregate by month, but for simplicity we will just return mock data for charts or simple aggregated counts.
    const mockChartData = [
      { name: 'Jan', revenue: 4000, leads: 24 },
      { name: 'Feb', revenue: 3000, leads: 13 },
      { name: 'Mar', revenue: 2000, leads: 98 },
      { name: 'Apr', revenue: 2780, leads: 39 },
      { name: 'May', revenue: 1890, leads: 48 },
      { name: 'Jun', revenue: 2390, leads: 38 },
      { name: 'Jul', revenue: totalRevenue > 0 ? totalRevenue : 3490, leads: leadsCount || 43 },
    ];

    return NextResponse.json({ 
      data: {
        metrics: {
          newLeads: leadsCount || 0,
          activeOrders: activeOrdersCount || 0,
          successfulDeals: successDealsCount || 0,
          revenue: totalRevenue || 0
        },
        chartData: mockChartData
      } 
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
