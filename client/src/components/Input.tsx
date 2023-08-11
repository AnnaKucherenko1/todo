import { useEffect, useState } from "react";

const Input = ({ label, type, onInputSubmit, formSubmited, setFormSubmited }: any) => {
  const [inputValue, setInputValue] = useState('');


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onInputSubmit(newValue);
    setFormSubmited(false)
  };
  useEffect(() => {
    if (formSubmited) {
      setInputValue('')
    }
  })



  return (
    <div className='form-control w-full max-w-xs'>
      <label className='label'>
        <span className='label-text'>{label}</span>
      </label>
      <input
        type={type}
        placeholder='Type here'
        className='input input-bordered w-full max-w-xs'
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};
export default Input;