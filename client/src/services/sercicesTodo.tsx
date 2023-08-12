import { Todo } from '../interfaces';
const URL = 'https://64d4b4f6b592423e469488e6.mockapi.io/todo/list';
export const addTodo = async (id: string, todo: Todo) => {

  try {
    const response = await fetch(URL + `/${id}/todo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch list');
    }
    return response.json();

  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const getTodos = async (id: string) => {

  try {
    const response = await fetch(URL + `/${id}/todo`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();

  } catch (error) {
    console.error('Error to fetch todo:', error);
    throw error;
  }
};

export const updateTodo = async (
  id: string,
  idTodo: string,
  updatedFields: any
) => {

  try {
    const response = await fetch(URL + `/${id}/todo/${idTodo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    const updatedTodo = await response.json();
    return updatedTodo;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteToDo = async (id: string, idTodo: string) => {
  try {
    const response = await fetch(URL + `/${id}/todo/${idTodo}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
