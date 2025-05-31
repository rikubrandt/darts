'use client'
import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  // Create a ref to track initialization
  const isInitialRender = useRef(true);
  
  // State to store our value
  const [storedValue, setStoredValue] = useState(initialValue);

  // Load from localStorage on first render
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      const item = window.localStorage.getItem(key);
      
      if (!item) {
        return;
      }

      const saved = JSON.parse(item);
      
      // Check if the saved data is expired (24 hours)
      const ageHrs = (Date.now() - (saved.timestamp || 0)) / 36e5;
      if (ageHrs < 24) {
        console.log(`Loading saved state for ${key}:`, saved);
        setStoredValue(saved);
      } else {
        // Data is expired, remove it
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Skip if trying to store the same value (to prevent loops)
      if (JSON.stringify(valueToStore) === JSON.stringify(storedValue) && !isInitialRender.current) {
        return;
      }
      
      // Save state
      setStoredValue(valueToStore);
      
      // After first render, start saving to localStorage
      if (isInitialRender.current) {
        isInitialRender.current = false;
      } else if (typeof window !== 'undefined') {
        // Save to localStorage
        if (valueToStore === null) {
          window.localStorage.removeItem(key);
        } else {
          const saveValue = {
            ...valueToStore,
            timestamp: Date.now()
          };
          console.log(`Saving state for ${key}:`, saveValue);
          window.localStorage.setItem(key, JSON.stringify(saveValue));
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}