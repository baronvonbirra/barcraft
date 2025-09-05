import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ukFlag from "../assets/uk-flag.png";
import esFlag from "../assets/spain-flag.png";

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
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      onClick={toggleLanguage}
      title={i18n.language === "en" ? "Switch to Spanish" : "Switch to English"}
    >
      {i18n.language === "en" ? (
        <img src={esFlag} alt="Spanish Flag" style={{ height: "1.5rem" }} />
      ) : (
        <img src={ukFlag} alt="UK Flag" style={{ height: "1.5rem" }} />
      )}
    </Button>
  );
};

export default LanguageSelector;
