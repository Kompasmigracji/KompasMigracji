import AIAssistantIntake from '@/components/AIAssistantIntake';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Kompas AI Асистент',
  description: 'Поговоріть з нашим розумним асистентом для швидкої відповіді на ваші питання з легалізації.',
};

export default function AIAssistantPage() {
  return (
    <>
      <Header />
      <main className="pt-[62px]">
        <AIAssistantIntake />
      </main>
      <Footer />
    </>
  );
}
