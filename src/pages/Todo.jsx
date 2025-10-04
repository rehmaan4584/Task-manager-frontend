import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo, getAllTodos,deleteTodo,editTodo,toggleTodo } from "../services/todoService";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const addTodo = async () => {
    if (task.trim() === "") return;
    const newTodo = await createTodo({ taskName: task });
    setTodos((prev) => [...prev, newTodo]);
    setTask("");
  };

  const getAllTodo = async () => {
    const res = await getAllTodos();
    setTodos(res);
  };
   

  const deleteTodoFn = async (id) => {
    console.log('id in todo comp',id);
    const deletedTask = await deleteTodo(id);
    setTodos(todos.filter((todo) => todo._id !== deletedTask._id));
  };

  const startEdit = (task) => {
    setEditingTodo(task);
  }

  const editingTodoFn = async (task) => {
    const editedTodo = await editTodo(task);
    setTodos((prev)=>{
     return prev.map((t)=> t._id === editedTodo._id ? editedTodo : t);
    });
    setEditingTodo(null);
    
  }

   const toggleTodoFn =async (id) => {
      const toggledTodo = await toggleTodo(id);
      setTodos((prev)=>{
        return prev.map((t)=> t._id === toggledTodo._id ? toggledTodo : t);
      })
   }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    getAllTodo();
  }, [navigate]);

  useEffect(()=>{
    if(editingTodo?._id){
      inputRef.current?.focus()
    }

  },[editingTodo])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center">
      
  <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/30">
    <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
      My Todos
    </h1>

    {/* input */}
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
      <button
        onClick={addTodo}
        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-500 text-white px-5 py-2 rounded-lg shadow-md transition"
      >
        Add
      </button>
    </div>

    {/* Todo list */}
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo._id}
          className="flex justify-between items-center bg-white/80 backdrop-blur-sm border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition"
        >
          {editingTodo?._id === todo._id ? (
            // edit mode
            <div className="flex justify-between items-center w-full gap-2">
              <input
                ref={inputRef}
                value={editingTodo.taskName}
                onChange={(e) =>
                  setEditingTodo({ ...editingTodo, taskName: e.target.value })
                }
                className="flex-1 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white text-sm rounded-md px-3 py-1 transition"
                onClick={() => editingTodoFn(editingTodo)}
              >
                Save
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white text-sm rounded-md px-3 py-1 transition"
                onClick={() => setEditingTodo(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            // normal mode
            <div className="flex justify-between items-center w-full">
              <span
                onClick={() => toggleTodoFn(todo._id)}
                className={`flex-1 cursor-pointer text-lg font-medium ${
                  todo.isCompleted
                    ? "line-through text-gray-400"
                    : "text-indigo-600"
                }`}
              >
                {todo.taskName}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(todo)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded-md shadow-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodoFn(todo._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md shadow-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
</div>

  );
};

export default Todo;
