import { useState, useCallback } from 'react';
import { debounce } from '../utils/validation';

export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Debounced validation
  const debouncedValidate = debounce((name, value) => {
    const rule = validationRules[name];
    if (!rule) return;
    
    const error = rule(value, formData);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, 300);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field if it's been touched
    if (touchedFields[name]) {
      debouncedValidate(name, value);
    }
  }, [touchedFields, debouncedValidate]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Validate immediately on blur
    const rule = validationRules[name];
    if (rule) {
      const error = rule(value, formData);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validationRules, formData]);

  const validateAll = useCallback(() => {
    const newFieldErrors = {};
    const newTouchedFields = {};
    
    Object.keys(validationRules).forEach(field => {
      newTouchedFields[field] = true;
      const rule = validationRules[field];
      if (rule) {
        const error = rule(formData[field], formData);
        if (error) {
          newFieldErrors[field] = error;
        }
      }
    });
    
    setTouchedFields(newTouchedFields);
    setFieldErrors(newFieldErrors);
    
    return {
      errors: newFieldErrors,
      isValid: Object.keys(newFieldErrors).length === 0
    };
  }, [formData, validationRules]);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setFieldErrors({});
    setTouchedFields({});
  }, [initialValues]);

  const setFieldError = useCallback((field, error) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    formData,
    fieldErrors,
    touchedFields,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setFieldError,
    clearFieldError,
    setFormData,
    setFieldErrors,
    setTouchedFields
  };
};
