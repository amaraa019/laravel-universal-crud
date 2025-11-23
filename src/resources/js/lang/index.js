import mn from './mn';
import en from './en';

let currentLang = 'mn'; // default language

const translations = {
    mn,
    en
};

export const setLang = (lang) => {
    currentLang = lang;
};

export const getLang = () => currentLang;

export const t = (key, replacements = {}) => {
    let translation = translations[currentLang]?.[key] || key;
    Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    return translation;
};