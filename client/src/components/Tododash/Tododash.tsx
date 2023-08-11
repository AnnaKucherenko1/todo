import moment from 'moment';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState, } from 'react';
import { addTodo, updateTodo, deleteToDo, getTodos } from '../../services/sercicesTodo';
import { useParams } from 'react-router-dom';
import Input from '../input';
import './TodoDash.css'

interface Todo {
  completed: boolean;
  deadline: string;
  todo: string;
  id: string;
  text: string;
}

const TodoDash = () => {
  const [formSubmited, setFormSubmited] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [inputValue, setInputValue] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [descriptValue, setDescriptValue] = useState('')
  const [todos, setTodos] = useState<Todo[]>([]);
  const { listId } = useParams()
  useEffect(() => {
    todosFetch(listId as string)
  }, [listId])
  const todosFetch = async (listId: string) => {
    let response = await getTodos(listId);
    setTodos(response)
  }
  const handleInputValueChange = (value: string) => {
    setInputValue(value);
  };

  console.log(listId)
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
      setTodos((prevTodosMap) => {
        const updatedTodos = [...prevTodosMap, response];
        return updatedTodos;
      });
      setFormSubmited(true);
    }

    setInputValue('');
    setDeadlineValue('');
    setDescriptValue('');
  };
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
    <div className='mainBody'>
      <div className='selector'>
        <select className='select select-bordered w-full max-w-xs' value={selectedFilter}
          onChange={(event) => setSelectedFilter(event.target.value)}
        >

          <option>All Todos</option>
          <option>Active</option>
          <option>Done</option>
        </select>
      </div>
      <form onSubmit={(event) => handleSubmit(listId as string, event)}>
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

      {todos?.filter((todo: { completed: any; }) => {
        if (selectedFilter === 'All') {
          return true;
        } else if (selectedFilter === 'Active') {
          return !todo.completed;
        } else if (selectedFilter === 'Done') {
          return todo.completed;
        }
        return true;
      })
        .map((todo: { todo: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; deadline: moment.MomentInput; completed: boolean | undefined; id: string; }, todoIndex: Key | null | undefined) => (
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
                onChange={() => handleToggle(listId as string, todo.id)}
              />
              <button onClick={() => handleDeleteTodo(listId as string, todo.id)}>
                delete
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}
export default TodoDash;