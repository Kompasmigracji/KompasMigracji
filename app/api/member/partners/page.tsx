'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Building, Tag, Link as LinkIcon, Loader2, AlertCircle, Star, ShieldCheck } from 'lucide-react';

// Определяем типы данных на основе ответа API
type Offer = {
  id: string;
  title: string;
  promo_code: string;
};

type Partner = {
  id: string;
  name: string;
  category: string;
  description: string;
  logo_url: string;
  website_url: string;
  rating: number;
  verification_status: string;
  offers: Offer[];
};

export default function PartnersPage() {
  const t = useTranslations('partners');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/member/partners');
        if (!response.ok) {
          throw new Error('Failed to fetch partners data');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setPartners(data.partners || []);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Получаем уникальные категории для фильтров
  const categories = useMemo(() => {
    if (partners.length === 0) return [];
    const allCategories = partners.map(p => p.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [partners]);

  // Фильтруем партнеров по выбранной категории
  const filteredPartners = useMemo(() => {
    if (activeCategory === 'All') {
      return partners;
    }
    return partners.filter(p => p.category === activeCategory);
  }, [partners, activeCategory]);

  // Компонент кнопок-фильтров
  const FilterButtons = () => (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {category === 'All' ? t('filter_all') : category}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-4 text-lg">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-400">{t('error')}</h3>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('desc')}</p>
      </div>

      <FilterButtons />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img className="h-16 w-16 rounded-full object-cover" src={partner.logo_url} alt={`${partner.name} logo`} />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{partner.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Building className="h-4 w-4 mr-1.5" />
                      {partner.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-yellow-500">
                  <Star className="h-4 w-4 mr-1" fill="currentColor" />
                  <span>{partner.rating}</span>
                </div>
              </div>

              <p className="mt-4 text-gray-600 dark:text-gray-300">{partner.description}</p>

              <div className="mt-4">
                {partner.offers.map((offer) => (
                  <div key={offer.id} className="flex items-center bg-green-50 dark:bg-green-900/30 p-3 rounded-lg mb-2">
                    <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">{offer.title}</p>
                      {offer.promo_code && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t('promo_code')}: <span className="font-semibold text-gray-700 dark:text-gray-200">{offer.promo_code}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                 <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <ShieldCheck className="h-4 w-4 mr-1.5" />
                    <span>{partner.verification_status}</span>
                 </div>
                 <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  {t('website')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}