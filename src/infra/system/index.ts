const getSystemLanguage = (): string => {
  if (navigator.language === 'el') return navigator.language;
  else return 'en';
}

const System = { getSystemLanguage };

export default System;