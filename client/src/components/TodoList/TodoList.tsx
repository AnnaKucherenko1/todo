import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteList, getList } from '../../services/servicesList';

import './TodoList.css';
interface Task {
  title: string;
  id: string;
}


const TodoList = ({ newList }: any) => {
  const [lists, setLists] = useState<Task[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
  }, [newList]);
  const fetchData = async () => {
    const response = await getList();
    setLists(response);

  };


  const handleDelete = async (id: string) => {
    try {
      await deleteList(id);
      const updatedLists = lists.filter((list) => list.id !== id);
      setLists(updatedLists);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const clickedList = (listId: string) => {
    navigate(`list/${listId}`)
  }
  return (
    <>
      {lists.map((list, index) => (
        <div className='mainBody' key={index} onClick={() => clickedList(list.id)}>
          <div className='title'>
            List Title: {list.title}
            <button
              className='btnDel btn-error'
              onClick={() => handleDelete(list.id)}
            >
              delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
export default TodoList;
