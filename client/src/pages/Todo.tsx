import { useState } from "react";
import Tododash from "../components/Tododash/Tododash";
import { addList } from "../services/servicesList";

const Todo = () => {
  const [inputValue, setInputValue] = useState('');


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    // onInputSubmit(newValue);
    console.log(inputValue, 'hhh')
  };

  const handleInputEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(inputValue);
      setInputValue('');
    }
  };
  const [newList, setNewList] = useState('')
  const handleSubmit = async (value: string) => {
    const newToDo = {
      title: value,
    };
    const newList = await addList(newToDo)
    setNewList(newList)
  };
  return (
    <>
      <div className='form-control w-full max-w-xs'>
        <label className='label'>
          <span className='label-text'>Add Title for new ToDo List here</span>
        </label>
        <input
          type="text"
          placeholder='Type here'
          className='input input-bordered w-full max-w-xs'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputEnter}
        />
      </div>
      <Tododash newList={newList} />
    </>
  );
}
export default Todo;
