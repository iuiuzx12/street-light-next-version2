import React, { useState } from 'react';
interface AProps {
    onSendData: (data: { A: string; B: string }) => void;
  }

const A: React.FC<AProps> = ({onSendData} : any) => {
  const [selectedOption, setSelectedOption] = useState<any>('option1');

  const options = {
    'option1': { A: "Data 1A", B: "Data 1B" },
    'option2': { A: "Data 2A", B: "Data 2B" },
    'option3': { A: "Data 3A", B: "Data 3B" },
  };

  const handleSendData = () => {
    onSendData(selectedOption);
  };

  return (
    <div>
      <h1>Component A</h1>
      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
        {Object.keys(options).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <button onClick={handleSendData}>Send Data to B</button>
    </div>
  );
};

export default A;