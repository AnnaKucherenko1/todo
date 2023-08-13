import { Todo } from '../../interfaces';
import moment from 'moment';
import { Key } from 'react';
import './Items.css';
import { updateTodo, deleteToDo } from '../../services/servicesTodo';
import { MdDeleteForever } from 'react-icons/md';
import { useParams } from 'react-router';

type ItemsProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  selectedFilter: string;
  searchTodo: string;
};

const Items = ({ todos, setTodos, selectedFilter, searchTodo }: ItemsProps) => {
  const { listId } = useParams();
  const handleToggle = async (listId: string, todoId: string) => {
    try {
      const todoToUpdate = todos.find((todo: Todo) => todo.id === todoId);
      if (todoToUpdate) {
        const updatedCompleted = !todoToUpdate.completed;
        await updateTodo(listId, todoId, { completed: updatedCompleted });
        const updatedTodos = todos.map((todo: Todo) =>
          todo.id === todoId ? { ...todo, completed: updatedCompleted } : todo
        );
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (listId: string, todoId: string) => {
    try {
      await deleteToDo(listId, todoId);
      const updatedTodos = todos.filter((todo: Todo) => todo.id !== todoId);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <>
      {todos.length === 0 ? (
        <p>Add your first todo to this list.</p>
      ) : (
        todos
          ?.filter((todo: { completed: boolean }) => {
            if (selectedFilter === 'All') {
              return true;
            } else if (selectedFilter === 'Active') {
              return !todo.completed;
            } else if (selectedFilter === 'Done') {
              return todo.completed;
            }
            return true;
          })
          ?.filter(
            (todo: Todo) =>
              todo.title.toLowerCase().includes(searchTodo.toLowerCase()) ||
              todo.description.toLowerCase().includes(searchTodo.toLowerCase())
          )
          .map((todo: Todo, todoIndex: Key) => (
            <div className='todo' key={todoIndex}>
              <div className='titleTodo'>{todo.title}</div>
              <div className='textTodo'> {todo.description}</div>
              <div className='deadline'>
                {todo.deadline && moment(todo.deadline).calendar()}
              </div>
              <div>
                <input
                  type='checkbox'
                  checked={todo.completed}
                  className='checkbox'
                  onChange={() =>
                    handleToggle(listId as string, todo.id as string)
                  }
                />
                <button
                  onClick={() =>
                    handleDeleteTodo(listId as string, todo.id as string)
                  }
                >
                  <MdDeleteForever
                    style={{ fontSize: '24px', marginLeft: '10px' }}
                  />
                </button>
              </div>
            </div>
          ))
      )}
    </>
  );
};
export default Items;
