import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  addTodo,
  deleteToDo,
  getTodos,
  updateTodo,
} from '../../services/sercicesTodo';
import { deleteList, getList } from '../../services/servicesList';
import Input from '../input';
import './Tododash.css';
interface Task {
  title: string;
  id: string;
}
interface Todo {
  completed: boolean;
  deadline: string;
  todo: string;
  id: string;
  text: string;
}
interface TodosMap {
  [key: string]: Todo[];
}
const Tododash = ({ newList }: any) => {
  const [inputValue, setInputValue] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [descriptValue, setDescriptValue] = useState('');
  const [formSubmited, setFormSubmited] = useState(false);
  const [lists, setLists] = useState<Task[]>([]);
  const [todosMap, setTodosMap] = useState<TodosMap>({});
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, [newList]);
  const fetchData = async () => {
    const response = await getList();
    setLists(response);

    const todosObject: { [key: string]: Todo[] } = {};
    for (const list of response) {
      const todos = await getTodos(list.id);
      todosObject[list.id] = todos;
    }

    setTodosMap(todosObject);
  };

  const handleInputValueChange = (value: string) => {
    setInputValue(value);
  };

  const handleDeadlineValueChange = (value: string) => {
    setDeadlineValue(value);
  };
  const handleDescrValueChange = (value: string) => {
    setDescriptValue(value);
  };
  const handleSubmit = async (
    listId: string,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const newToDo = {
      todo: inputValue,
      text: descriptValue,
      deadline: deadlineValue,
      completed: false,
    };
    const response = await addTodo(listId, newToDo);
    if (response) {
      //@ts-ignore
      setTodosMap((prevTodosMap) => {
        const updatedTodos = [...(prevTodosMap[listId] || []), response];
        return { ...prevTodosMap, [listId]: updatedTodos };
      });
      setFormSubmited(true);
    }

    setInputValue('');
    setDeadlineValue('');
    setDescriptValue('');
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
  const handleToggle = async (listId: string, todoId: string) => {
    try {
      const todoToUpdate = todosMap[listId].find((todo) => todo.id === todoId);

      if (todoToUpdate) {
        const updatedCompleted = !todoToUpdate.completed;
        await updateTodo(listId, todoId, { completed: updatedCompleted });
        setTodosMap((prevTodosMap) => {
          const updatedTodos = prevTodosMap[listId].map((todo) =>
            todo.id === todoId ? { ...todo, completed: updatedCompleted } : todo
          );
          return { ...prevTodosMap, [listId]: updatedTodos };
        });
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  const handleDeleteTodo = async (listId: string, todoId: string) => {
    try {
      await deleteToDo(listId, todoId);
      setTodosMap((prevTodosMap) => {
        const updatedTodos = prevTodosMap[listId].filter(
          (todo) => todo.id !== todoId
        );
        return { ...prevTodosMap, [listId]: updatedTodos };
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <>
      <div className='selector'>
        <select className='select select-bordered w-full max-w-xs' value={selectedFilter}
          onChange={(event) => setSelectedFilter(event.target.value)}
        >

          <option>All</option>
          <option>Active</option>
          <option>Done</option>
        </select>
      </div>
      {lists.map((list, index) => (
        <div className='mainBody' key={index}>
          <div className='title'>
            List Title: {list.title}
            <button
              className='btnDel btn-error'
              onClick={() => handleDelete(list.id)}
            >
              delete
            </button>
          </div>
          <form onSubmit={(event) => handleSubmit(list.id, event)}>
            <div className='inputdiv'>
              <Input
                label={'Add ToDo Title here'}
                type={'text'}
                onInputSubmit={handleInputValueChange}
                formSubmited={formSubmited}
                setFormSubmited={setFormSubmited}
              />
              <Input
                label={'Add ToDo description here'}
                type={'text'}
                onInputSubmit={handleDescrValueChange}
                formSubmited={formSubmited}
                setFormSubmited={setFormSubmited}
              />
              <Input
                label={'Add deadline'}
                type={'datetime-local'}
                onInputSubmit={handleDeadlineValueChange}
                formSubmited={formSubmited}
                setFormSubmited={setFormSubmited}
              />
              <button type='submit' className='btn btn-accent mt-4'>
                Submit
              </button>
            </div>
          </form>

          {todosMap[list.id]
            ?.filter(todo => {
              if (selectedFilter === 'All') {
                return true;
              } else if (selectedFilter === 'Active') {
                return !todo.completed;
              } else if (selectedFilter === 'Done') {
                return todo.completed;
              }
              return true;
            })
            .map((todo, todoIndex) => (
              <div className='todo' key={todoIndex}>
                {todo.todo}
                <div> {todo.text}</div>
                <div className='deadline'>
                  {todo.deadline && moment(todo.deadline).endOf('day').fromNow()}
                </div>
                <div>
                  <input
                    type='checkbox'
                    checked={todo.completed}
                    className='checkbox'
                    onChange={() => handleToggle(list.id, todo.id)}
                  />
                  <button onClick={() => handleDeleteTodo(list.id, todo.id)}>
                    delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </>
  );
};
export default Tododash;
