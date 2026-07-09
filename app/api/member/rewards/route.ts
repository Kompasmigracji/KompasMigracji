import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for rewards and achievements
  // In a real scenario, this would query kompas_user_achievements from Supabase
  const achievements = [
    {
      id: 1,
      title: "Перший Крок",
      description: "Заповнено базовий профіль",
      iconName: "Star",
      progress: 100,
      reward: 100,
      locked: false,
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      title: "Легальний Статус",
      description: "Завантажено карту побиту або візу",
      iconName: "Shield",
      progress: 100,
      reward: 500,
      locked: false,
      color: "from-emerald-500 to-teal-400"
    },
    {
      id: 3,
      title: "Кар'єрист",
      description: "Подано 5 відгуків на вакансії",
      iconName: "TrendingUp",
      progress: 60,
      reward: 200,
      locked: false,
      color: "from-amber-500 to-orange-400"
    },
    {
      id: 4,
      title: "Амбасадор",
      description: "Запрошено 3 друзів у Kompas",
      iconName: "Award",
      progress: 0,
      reward: 1000,
      locked: true,
      color: "from-purple-500 to-pink-400"
    }
  ];

  return NextResponse.json({
    success: true,
    data: {
      balance: 1250,
      achievements
    }
  });
}
