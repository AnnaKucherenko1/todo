import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteList, getList } from '../../services/servicesList';
import { MdDeleteForever } from 'react-icons/md';
import './TodoList.css';
import { ListContext } from '../../App';

type TodoListProps = {
  newList: string;
};

const TodoList = ({ newList }: TodoListProps) => {
  const { setLists, lists } = useContext(ListContext);
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

  const handleDeleteClick = (event: React.MouseEvent, listId: string) => {
    event.stopPropagation();
    handleDelete(listId);
  };

  const clickedList = (listId: string) => {
    navigate(`list/${listId}`);
  };

  return (
    <>
      {lists.length === 0 ? (
        <p>Add your first Todo List here.</p>
      ) : (
        lists.map((list, index) => (
          <div
            className='mainBody'
            key={index}
            onClick={() => clickedList(list.id as string)}
          >
            <div className='title'>
              <b>{list.title}</b>
              <button
                className='btnDel'
                onClick={(event) => handleDeleteClick(event, list.id as string)}
              >
                <MdDeleteForever />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};
export default TodoList;
