import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/todo/find/${currentUser._id}`, {
        method: "GET",
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message);
      } else {
        const todoData = await res.json();
        setTodos(todoData);
      }
    } catch (error) {
      setError("An error occurred while fetching the todos.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, [currentUser]);

  const createTodochange = (e) => {
    if (e.target.id === "title") {
      setTitle(e.target.value);
    } else if (e.target.id === "description") {
      setDescription(e.target.value);
    }
  };

  const createTodosubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/todo/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, userRef: currentUser._id }),
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        alert("TODO CREATED SUCCESSFULLY.");
        fetchTodos();
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("An error occurred while creating the todo.");
    }
  };

  const markTodo = async (id, completed) => {
    try {
      const res = await fetch(`/api/todo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) {
        fetchTodos();
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("An error occurred while updating the todo.");
    }
  };

  const removeTodo = async (id) => {
    try {
      const res = await fetch(`/api/todo/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("An error occurred while deleting the todo.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          To-Do List
        </h1>
      </div>
      <form
        className="w-full max-w-sm mx-auto px-4 py-2"
        onSubmit={createTodosubmit}
      >
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            id="title"
            type="text"
            value={title}
            onChange={createTodochange}
            placeholder="Add a task"
            required
          />
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            id="description"
            type="text"
            value={description}
            onChange={createTodochange}
            placeholder="Description"
            required
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      {successMessage && (
        <div className="text-green-500 px-4 py-2">{successMessage}</div>
      )}
      <ul className="divide-y divide-gray-200">
        {todos.map((data) => (
          <li key={data._id} className="py-4 hover:bg-gray-100 transition-all">
            <div className="flex items-center">
              <input
                id={`todo${data._id}`}
                name={`todo${data._id}`}
                type="checkbox"
                checked={data.completed}
                onChange={() => markTodo(data._id, data.completed)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`todo${data._id}`}
                className="ml-3 block text-gray-900"
              >
                <span
                  className={`text-lg font-medium ${
                    data.completed
                      ? "line-through text-green-600"
                      : "text-gray-800"
                  }`}
                >
                  {data.title}
                </span>
                <span className="text-sm font-light text-gray-500">
                  {data.description}
                </span>
              </label>
              <button
                onClick={() => removeTodo(data._id)}
                className="ml-auto flex-shrink-0 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
