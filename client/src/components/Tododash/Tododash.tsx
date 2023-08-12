import moment from 'moment';
import { Key, useEffect, useState, } from 'react';
import { addTodo, updateTodo, deleteToDo, getTodos } from '../../services/sercicesTodo';
import { useParams } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import { Formik, Field, Form } from "formik";
import todoSchema from '../../validator';
import { FormValues, Todo, Values } from '../../interfaces';
import './TodoDash.css'

const TodoDash = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [todos, setTodos] = useState<Todo[]>([]);
  const { listId } = useParams()

  useEffect(() => {
    todosFetch(listId as string)
  }, [listId])

  const todosFetch = async (listId: string) => {
    let response = await getTodos(listId);
    setTodos(response)
  }

  const handleSubmit = async (
    listId: string,
    values: Values,
    resetForm: () => void
  ) => {
    try {
      const newToDo = {
        title: values.title,
        description: values.description,
        deadline: values.deadline,
        completed: false,
      };

      const response = await addTodo(listId, newToDo);
      if (response) {
        setTodos((prevTodosMap) => {
          const updatedTodos = [...prevTodosMap, response];
          return updatedTodos;
        });
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting todo:', error);
    }
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
      <div className='formDiv'>
        <Formik
          initialValues={{ title: "", description: "", deadline: "" }}
          validate={(values: FormValues) => {
            const errors: Partial<FormValues> = {};
            if (!values.title) {
              errors.title = 'Title is required';
            }
            if (!values.description) {
              errors.description = 'Description is required';
            }
            if (!values.deadline) {
              errors.deadline = 'Deadline is required';
            }
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            todoSchema
              .validateAsync(values)
              .then(() => {
                handleSubmit(listId as string, values, resetForm);
              })
              .catch(validationError => {
                console.error('Validation error:', validationError);
              });
          }}
        >
          {({ errors }) => (
            <Form>
              <div className='inputdiv'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Add ToDo Title here</span>
                  </label>
                  <Field
                    type='text'
                    name='title'
                    className='input input-bordered w-full max-w-xs'
                  />
                  {errors.title && (
                    <div className='bg-red-600'>{errors.title}</div>
                  )}
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Add ToDo description here</span>
                  </label>
                  <Field
                    type='text'
                    name='description'
                    className='input input-bordered w-full max-w-xs'
                  />
                  {errors.description && (
                    <div className='bg-red-600'>{errors.description}</div>
                  )}
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Add deadline</span>
                  </label>
                  <Field
                    type='datetime-local'
                    name='deadline'
                    className='input input-bordered w-full max-w-xs'
                  />
                  {errors.deadline && (
                    <div className='bg-red-600'>{errors.deadline}</div>
                  )}
                </div>
                <button type='submit' className='btn btn-accent'>
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {
        todos.length === 0 ? (
          <p>Add your first todo to this list.</p>
        ) : (
          todos?.filter((todo: { completed: boolean; }) => {
            if (selectedFilter === 'All') {
              return true;
            } else if (selectedFilter === 'Active') {
              return !todo.completed;
            } else if (selectedFilter === 'Done') {
              return todo.completed;
            }
            return true;
          })
            .map((todo: Todo, todoIndex: Key) => (
              <div className='todo' key={todoIndex}>
                <div className='titleTodo'>{todo.title}</div>
                <div className='textTodo'> {todo.description}</div>
                <div className='deadline'>
                  {todo.deadline && moment(todo.deadline).endOf('day').fromNow()}
                </div>
                <div>
                  <input
                    type='checkbox'
                    checked={todo.completed}
                    className='checkbox'
                    onChange={() => handleToggle(listId as string, todo.id as string)}
                  />
                  <button onClick={() => handleDeleteTodo(listId as string, todo.id as string)}>
                    <MdDeleteForever style={{ fontSize: '24px', marginLeft: '10px' }} />
                  </button>
                </div>
              </div>
            ))
        )
      }

    </div >
  )
}
export default TodoDash;