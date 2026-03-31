import { useState, useEffect, useCallback } from 'react';
import { FormValues } from '@/types/leads';

const STORAGE_KEY = 'retail-leads-finder-form';

const defaultValues: FormValues = {
  type: '',
  location: '',
  radius: 10,
  limit: 20,
};

export const useFormPersistence = () => {
  const [values, setValues] = useState<FormValues>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Mescla com os valores padrão para garantir que campos novos existam
        return { ...defaultValues, ...JSON.parse(stored) };
      }
    } catch {
      console.warn('[useFormPersistence] Erro ao carregar valores salvos do localStorage');
    }
    return defaultValues;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      console.warn('[useFormPersistence] Erro ao persistir valores no localStorage');
    }
  }, [values]);

  const updateValue = useCallback(<K extends keyof FormValues>(
    key: K,
    value: FormValues[K]
  ) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetValues = useCallback(() => {
    setValues(defaultValues);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    values,
    updateValue,
    resetValues,
    setValues,
  };
};
