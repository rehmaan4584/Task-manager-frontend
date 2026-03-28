import { api } from "./api";

export const createTodo = async (task) => {
    const res = await api.post('/task/create',task);
    // console.log('res from creating task',res);
    return res.data.data;
}

export const getAllTodos = async () => {
    const allTodos = await api.get('/task/all');
    return allTodos?.data?.data;
}

export const deleteTodo = async (id) => {
    const deleteTask = await api.delete(`/task/${id}`)
    return deleteTask?.data?.data;
}

export const editTodo = async (id, data) => {
  const res = await api.put(`/task/${id}`, data);
  return res?.data?.data;
};

export const toggleTodo = async (id) => {
    const res = await api.patch(`/task/${id}/toggle`);
    return res?.data?.data;
}