const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding buyers and orders...");
  
  // 1. Create Buyers
  const buyersData = [
    { full_name: "Alena Holovina", email: "alena@example.com", phone: "+380501234567" },
    { full_name: "Artur", email: "roman@protonmail.com", phone: "+380630113262" },
    { full_name: "Yurii", email: "yurii@proton.me", phone: "+48500200300" }
  ];

  const { data: buyers, error: bErr } = await supabase
    .from('buyers')
    .insert(buyersData)
    .select();

  if (bErr) {
    console.error("Error inserting buyers:", bErr);
    return;
  }
  console.log("Inserted buyers:", buyers.length);

  // 2. Create Orders for these buyers
  const ordersData = [
    { order_number: "ORD-001", buyer_id: buyers[0].id, status: "Новый", payment_status: "Не оплачен", total_price: 150.00 },
    { order_number: "ORD-002", buyer_id: buyers[1].id, status: "Выполняется", payment_status: "Оплачен", total_price: 320.50 },
    { order_number: "ORD-003", buyer_id: buyers[1].id, status: "Новый", payment_status: "Частично оплачен", total_price: 50.00 },
    { order_number: "ORD-004", buyer_id: buyers[2].id, status: "Завершен", payment_status: "Оплачен", total_price: 1000.00 }
  ];

  const { data: orders, error: oErr } = await supabase
    .from('orders')
    .insert(ordersData)
    .select();

  if (oErr) {
    console.error("Error inserting orders:", oErr);
    return;
  }
  console.log("Inserted orders:", orders.length);
}

seed();
