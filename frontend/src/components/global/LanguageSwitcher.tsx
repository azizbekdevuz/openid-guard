'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18nInstance from '@/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the current locale from cookie
  const { t, i18n } = useTranslation('common', { i18n: i18nInstance });
  const [currentLocale, setCurrentLocale] = useState('en');
  
  useEffect(() => {
    // Get locale from cookie
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setCurrentLocale(match[2]);
    }
  }, []);
  
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbek' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' }
  ];

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (locale: string) => {
    // Close the dropdown
    setIsOpen(false);
    
    // Set the cookie for the new locale
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    
    // Update the UI immediately
    setCurrentLocale(locale);
    
    // Change language in i18n instance
    i18nInstance.changeLanguage(locale);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggleDropdown}
        className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={16} />
        <span className="text-sm">{languages.find(lang => lang.code === currentLocale)?.nativeName || 'English'}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50"
          >
            <div className="py-1 rounded-md bg-gray-800 shadow-xs" role="menu" aria-orientation="vertical">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors 
                    ${currentLocale === language.code ? 'text-blue-400 font-medium' : 'text-gray-300'}`
                  }
                  role="menuitem"
                >
                  <span>{language.nativeName}</span>
                  <span className="ml-2 text-gray-500">{language.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;