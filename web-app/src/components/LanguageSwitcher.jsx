import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="material-icons text-gray-500 text-sm md:text-base">translate</span>
      <select 
        onChange={changeLanguage} 
        value={i18n.language.split('-')[0]} // e.g. handle en-US as en
        className="bg-transparent text-sm md:text-base font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-primary outline-none"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="mr">मराठी</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
