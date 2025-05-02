
/**
 * Utility functions for working with localStorage
 */

export const getLocalStorageItem = (key: string, defaultValue: string = ''): string => {
  return localStorage.getItem(key) || defaultValue;
};

export const setLocalStorageItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};
