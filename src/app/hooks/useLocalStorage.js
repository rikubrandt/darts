'use client'
import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(initialValue);
  
  // Flag to prevent initial load effect from running twice
  const initialized = useRef(false);

  // Initialize state on first render only
  useEffect(() => {
    if (initialized.current) return;
    
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      
      if (!item) {
        initialized.current = true;
        return;
      }

      const saved = JSON.parse(item);
      
      // Check if the saved data is expired (24 hours)
      const ageHrs = (Date.now() - (saved.timestamp || 0)) / 36e5;
      if (ageHrs < 24) {
        setStoredValue(saved);
      } else {
        // Data is expired, remove it
        window.localStorage.removeItem(key);
      }
      
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    
    initialized.current = true;
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Only update if the value actually changed
      if (JSON.stringify(valueToStore) !== JSON.stringify(storedValue)) {
        // Save state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          if (valueToStore === null) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}