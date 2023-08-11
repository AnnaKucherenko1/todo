const URL = "https://64d4b4f6b592423e469488e6.mockapi.io/todo/list"
export const addList = async (newList: any) => {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newList)
    });

    if (!response.ok) {
      throw new Error('Failed to add list');
    }

    return response.json();
  } catch (error) {

    console.error('Failed to add list:', error);

    throw error;
  }
}
export const getList = async () => {
  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch list');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch list:', error);
    throw error;
  }
}
export const deleteList = async (id: string) => {
  try {
    const response = await fetch(URL + '/' + id, {
      method: 'DELETE',
    })
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Failed to delete list:', error);
    throw error;
  }
}
