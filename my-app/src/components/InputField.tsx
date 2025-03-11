import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number' | 'url' | 'email' | 'tel' | 'date';
  error?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required = false,
}) => {
  const isTextArea = type === 'textarea';
  const Component = isTextArea ? 'textarea' : 'input';

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Component
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={!isTextArea ? type : undefined}
        className={`bg-[#1c2126] text-white rounded-xl border border-[#3c4753] p-3 placeholder-[#9dabb8] w-full ${
          isTextArea ? 'min-h-[100px]' : ''
        } ${error ? 'border-red-500' : ''}`}
        required={required}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputField;
