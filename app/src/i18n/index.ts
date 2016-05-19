import { de_DE } from './de_DE';
import { en_US } from './en_US';

export interface I18NMessages {
    [key: string]: I18NLanguage;
}

export interface I18NLanguage {
    [key: string]: string;
}

export const messages: I18NMessages = {
    de_DE,
    en_US
};
