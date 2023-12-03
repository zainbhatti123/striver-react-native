import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState();

  async function getStoredItem(sKey, sInitialValue) {
    try {
      const item = await AsyncStorage.getItem(sKey);
      const value = item ? JSON.parse(item) : sInitialValue;
      setStoredValue(value);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStoredItem(key, initialValue);
  }, [key, initialValue]);

  const setValue = async value => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
