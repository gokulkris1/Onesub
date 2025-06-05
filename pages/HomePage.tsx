
import React from 'react';
import BundleCard from '../components/BundleCard';
import { BUNDLES_DATA } from '../constants';
import { Bundle } from '../types';

interface HomePageProps {
  onChooseBundle: (bundle: Bundle) => void;
  onOpenAuthModal: (type: 'login' | 'signup') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onChooseBundle, onOpenAuthModal }) => {
  return (
    <>
      <section id="bundles" aria-labelledby="bundles-heading">
        <h2 id="bundles-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-10 text-center">
          Choose Your Perfect Bundle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUNDLES_DATA.map(bundle => (
            <BundleCard 
              key={bundle.id} 
              bundle={bundle} 
              onChooseBundle={onChooseBundle}
              onOpenAuthModal={onOpenAuthModal}
            />
          ))}
        </div>
      </section>

      <section className="mt-20 py-12 bg-slate-100 rounded-xl shadow-xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Why OneSub?</h2>
        <div className="max-w-3xl mx-auto text-lg text-slate-700 space-y-4 text-center">
          <p>
            At OneSub, we partner with your favorite creators and services to bring you exclusive bundles. 
            By combining subscriptions, everyone wins: creators reach more people, and you get premium access for less.
          </p>
          <p>
            It's simple: enjoy more, pay less. No hidden fees, just straightforward savings and convenience.
          </p>
        </div>
      </section>
    </>
  );
};

export default HomePage;