/**
 * Dependency imports
 */
import { applyDefaults, queryObject, getType } from 'noyb';

/**
 * Local imports
 */
import { isSSR } from '../utils/helpers';

/**
 * Helper functions
 */
export const saveValueToLocalStorage = <T>(key: string, value: T) => {
  if (isSSR()) return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getValueFromLocalStorage = <T>(key: string, defaultValue: T) => {
  if (isSSR()) return;
  
  const storedValue = localStorage.getItem(key);
  const value = storedValue ? JSON.parse(storedValue) as T : defaultValue;
  
  if (getType(storedValue) === 'object' && defaultValue) {
    return applyDefaults<T>(value, defaultValue);
  }

  return value ?? defaultValue;
};

/**
 * LocalStorageService class
 */
class LocalStorageService<T> {
  protected key: string;
  protected defaultValue: T;
  
  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  get(key: string) {
    if (!key) return getValueFromLocalStorage(this.key, this.defaultValue);
    return queryObject(key, getValueFromLocalStorage(this.key, this.defaultValue) as any);
  }

  set(key: string, value: any) {
    const updatedValue = queryObject(key, getValueFromLocalStorage(this.key, this.defaultValue) as any, value);
    saveValueToLocalStorage(this.key, updatedValue);
  }

  clear() {
    if (isSSR()) return;
    localStorage.removeItem(this.key);
  }
}

/**
 * Default export
 */
const localStorageServices = {
  settings: (
    new LocalStorageService<{
      prayers: {
        alarms: {
          enable: boolean,
          list: string[],
        }
      },
    }>('ana-muslim-settings', {
      prayers: {
        alarms: {
          enable: false,
          list: [],
        },
      },
    })
  ),

  favoritePhotos: (
    new LocalStorageService<{
      photos: Photo[],
    }>('ana-muslim-favorite-photos', {
      photos: [],
    })
  ),
}

export default localStorageServices;
