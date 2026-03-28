import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTodo,
  getAllTodos,
  deleteTodo,
  editTodo,
  toggleTodo,
} from "../services/todoService";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const addTodo = async () => {
    if (task.trim() === "") return;
    const newTodo = await createTodo({ taskName: task.trim() });
    setTodos((prev) => [...prev, newTodo]);
    setTask("");
  };

  const getAllTodo = async () => {
    try {
      const res = await getAllTodos();
      setTodos(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodoFn = async (id) => {
    const deletedTask = await deleteTodo(id);
    setTodos((prev) => prev.filter((todo) => todo._id !== deletedTask._id));
  };

  const startEdit = (t) => {
    setEditingTodo(t);
  };

  const editingTodoFn = async () => {
    const editedTodo = await editTodo(editingTodo._id, {
      taskName: editingTodo.taskName.trim(),
    });

    if (!editedTodo) return;
    setTodos((prev) =>
      prev.map((t) => (t._id === editedTodo._id ? editedTodo : t)),
    );
    setEditingTodo(null);
  };

  const toggleTodoFn = async (id) => {
    const toggledTodo = await toggleTodo(id);
    setTodos((prev) =>
      prev.map((t) => (t._id === toggledTodo._id ? toggledTodo : t)),
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getAllTodo();
  }, [navigate]);

  useEffect(() => {
    if (editingTodo?._id) {
      inputRef.current?.focus();
    }
  }, [editingTodo]);

  return (
    <div className="page-shell min-h-[calc(100vh-4rem)] px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-lg">
        <header className="mb-8 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
            Today
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your tasks
          </h1>
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Tap a task to mark it done. Stay focused — one list, clear
            priorities.
          </p>
        </header>

        <div className="glass-card p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTodo();
                }
              }}
              placeholder="What needs doing?"
              aria-label="New task"
              className="input-premium sm:flex-1"
            />
            <button
              type="button"
              onClick={addTodo}
              className="shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-glow transition hover:from-amber-400 hover:to-amber-500 sm:w-auto"
            >
              Add
            </button>
          </div>

          {loading ? (
            <div className="mt-10 flex flex-col items-center gap-3 py-12">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-amber-500"
                aria-hidden
              />
              <p className="text-sm text-zinc-500">Loading tasks…</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-zinc-700/80 bg-zinc-950/30 px-6 py-14 text-center">
              <p className="font-medium text-zinc-300">Nothing here yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Add your first task above. Small steps add up.
              </p>
            </div>
          ) : (
            <ul className="mt-8 space-y-3" aria-label="Task list">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="group rounded-xl border border-zinc-700/60 bg-zinc-950/40 p-4 transition hover:border-zinc-600/80 hover:bg-zinc-900/40"
                >
                  {editingTodo?._id === todo._id ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        ref={inputRef}
                        value={editingTodo.taskName}
                        onChange={(e) =>
                          setEditingTodo({
                            ...editingTodo,
                            taskName: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            editingTodoFn();
                          }
                        }}
                        className="input-premium sm:flex-1"
                        aria-label="Edit task"
                      />
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="flex-1 rounded-lg bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:flex-none"
                          onClick={editingTodoFn}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-lg border border-zinc-600 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 sm:flex-none"
                          onClick={() => setEditingTodo(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => toggleTodoFn(todo._id)}
                        className={`flex max-w-full flex-1 cursor-pointer select-none text-left text-base font-medium transition sm:pr-4 ${
                          todo.isCompleted
                            ? "text-zinc-500 line-through decoration-zinc-600"
                            : "text-zinc-100 hover:text-amber-200/90"
                        }`}
                        aria-pressed={todo.isCompleted}
                      >
                        <span
                          className={`mr-3 mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                            todo.isCompleted
                              ? "border-amber-500/80 bg-amber-500/20 text-amber-400"
                              : "border-zinc-600 group-hover:border-zinc-500"
                          }`}
                          aria-hidden
                        >
                          {todo.isCompleted ? "✓" : ""}
                        </span>
                        <span className="min-w-0 break-words">
                          {todo.taskName}
                        </span>
                      </button>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(todo)}
                          className="rounded-lg border border-zinc-600 bg-zinc-900/50 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-amber-500/40 hover:bg-zinc-800/80 sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTodoFn(todo._id)}
                          className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
