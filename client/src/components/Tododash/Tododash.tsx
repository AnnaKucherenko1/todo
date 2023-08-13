import { useEffect, useState } from 'react';
import { addTodo, getTodos } from '../../services/sercicesTodo';
import { useParams } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import todoSchema from '../../validator';
import { FormValues, Todo, Values } from '../../interfaces';
import './TodoDash.css';
import Items from '../Items/Items';

const TodoDash = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTodo, setSearchTodo] = useState('');
  const { listId } = useParams();

  useEffect(() => {
    todosFetch(listId as string);
  }, [listId]);

  const todosFetch = async (listId: string) => {
    const response = await getTodos(listId);
    setTodos(response);
  };

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

  return (
    <div className='mainBody'>
      <div className='selector'>
        <select
          className='select select-bordered w-full max-w-xs'
          value={selectedFilter}
          onChange={(event) => setSelectedFilter(event.target.value)}
        >
          <option>All Todos</option>
          <option>Active</option>
          <option>Done</option>
        </select>
        <div className='form-control'>
          <input
            type='text'
            placeholder='Search ToDo'
            value={searchTodo}
            onChange={(e) => setSearchTodo(e.target.value)}
            className='input input-bordered w-24 md:w-auto'
          />
        </div>
      </div>
      <div className='formDiv'>
        <Formik
          initialValues={{ title: '', description: '', deadline: '' }}
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
              .catch((validationError) => {
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
                    <span className='label-text'>
                      Add ToDo description here
                    </span>
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
      <Items
        todos={todos}
        setTodos={setTodos}
        selectedFilter={selectedFilter}
        searchTodo={searchTodo}
      />
    </div>
  );
};
export default TodoDash;
