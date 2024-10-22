import React from 'react';

const CustomRadioButton = ({ options, selected, onChange }: any) => {
  return (
    <div className="flex flex-col mb-4">
      {options.map((option : any) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          <input
            type="radio"
            value={option.value}
            checked={selected === option.value}
            onChange={onChange}
            className="hidden"
          />
          <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center mr-2">
            {selected === option.value && (
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <span className="text-lg">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CustomRadioButton;