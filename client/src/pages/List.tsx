import { useState } from 'react';
import TodoList from '../components/TodoList/TodoList';
import { addList } from '../services/servicesList';

const List = () => {
  const [inputValue, setInputValue] = useState('');
  const [newList, setNewList] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  const handleInputEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      try {
        const newToDo = {
          title: inputValue,
        };
        const newList = await addList(newToDo);
        setNewList(newList);
        setInputValue('');
      } catch (error) {
        console.error('Error adding new list:', error);
      }
    }
  };


  return (
    <>
      <div className='form-control w-full max-w-xs'>
        <label className='label'>
          <span className='label-text'>Add Title for new ToDo List here</span>
        </label>
        <input
          type='text'
          placeholder='Type name and press enter'
          className='input input-bordered w-full max-w-xs'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputEnter}
        />
      </div>
      <TodoList newList={newList} />
    </>
  );
};
export default List;
