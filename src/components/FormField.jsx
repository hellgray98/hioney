import React from 'react';
import InputField from './InputField';
import ValidationMessage from './ValidationMessage';

const FormField = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  icon,
  showPassword,
  onTogglePassword,
  className = '',
  animationClass = '',
  ...props
}) => {
  return (
    <div className={`group ${animationClass}`}>
      <InputField
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        label={label}
        error={error}
        touched={touched}
        required={required}
        icon={icon}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        className={className}
        {...props}
      />
    </div>
  );
};

export default FormField;
