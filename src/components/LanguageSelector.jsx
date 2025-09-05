import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Button = styled.button`
  background: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 1.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div>
      <Button onClick={toggleLanguage} title={i18n.language === 'en' ? 'Switch to Spanish' : 'Switch to English'}>
        {i18n.language === 'en' ? '🇪🇸' : '🇬🇧'}
      </Button>
    </div>
  );
};

export default LanguageSelector;
