import { createContext } from 'react';
import { Ii18nProvider } from '../infra/i18n';
import { IAuthProvider } from '../infra/auth';
import MockAuthProvider from '../infra/auth/mock';
import System from '../infra/system';
import I18Next from '../infra/i18n/I18next';
import { translations } from '../infra/i18n'
import FirebaseAuthProvider from '../infra/auth/firebase';

export interface IDI {
    i18n: Ii18nProvider;
    auth: IAuthProvider;
    language: string;
    latestChange: number;
}

const localStorageLanguage = localStorage.getItem('language');
const systemLanguage = System.getSystemLanguage().substring(0, 2) === 'en' || System.getSystemLanguage().substring(0, 2) === 'el' ? System.getSystemLanguage().substring(0, 2) : 'el';
const language = localStorageLanguage ? localStorageLanguage : systemLanguage;

export const initialDependencies = {
    i18n: new I18Next(language, translations),
    auth: process.env.REACT_APP_ENVIRONMENT === 'mock' ? new MockAuthProvider() : new FirebaseAuthProvider(),
    language,
    latestChange: Date.now(),
};

const DI = createContext<[IDI, React.Dispatch<React.SetStateAction<IDI>>]>([initialDependencies, () => {}]);

export default DI;
