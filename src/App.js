import React, { useRef, useState } from "react";

const TodosProgress = ({ todos }) => {

  // Calc percentage progress:
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const totalTodos = todos.length;
  const progressPercentage = totalTodos ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div className="todos-progress p-3 rounded-md bg-box-bg-color flex items-center justify-between">
      <h2 className="font-medium">Today's todos</h2>
      {/* Progress State */}
      <div className="progress-state relative w-12 h-12">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Back Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#555"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Front Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="white"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (progressPercentage / 100) * 251.2}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-500"
          />
        </svg>
        {/* Percentage Progress */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {Math.round(progressPercentage)}%
        </span>
      </div>
    </div>
  )
};
const Todo = ({ todo, handleCompleteTodo, handleDeleteTodo }) => {
  return (
    <div
      className={`todo p-3 rounded-md bg-box-bg-color flex gap-3 justify-between items-center transition-opacity ${todo.completed ? 'opacity-50' : ''
        }`}
    >
      {/* Todo Info */}
      <div className="todo-info flex-1">
        {/* Title */}
        <label
          htmlFor={'todo-' + todo.id}
          className={`cursor-pointer select-none font-semibold mb-1 w-fit block ${todo.completed ? 'line-through' : ''}`}
        >{todo.title}</label>
        {/* Created At */}
        <p className="text-gray-400 text-sm font-medium">{todo.createdAt}</p>
      </div>
      {/* Todo Actions */}
      <div className="todo-actions flex items-center gap-2">
        {/* Checkbox */}
        <label className="checkbox cursor-pointer flex items-center justify-center border w-5 h-5 rounded-md text-xs">
          <input
            id={'todo-' + todo.id}
            type="checkbox"
            checked={todo.completed}
            onChange={handleCompleteTodo}
            className="hidden peer"
          />
          <div className="scale-0 peer-checked:scale-100 transition">
            <i className="fa-solid fa-check"></i>
          </div>
        </label>
        {/* Edit */}
        {/* Delete */}
        <button
          type="button"
          onClick={handleDeleteTodo}
          aria-label="Delete Todo"
          title="Delete Todo"
          className="sm:hover:text-red-500 transition-colors text-lg"
        >
          <i className="fa-solid fa-trash-can fa-fw"></i>
        </button>
      </div>
    </div>
  )
};
const AddTodo = ({ addTodoRef, handleChangeAdd, handleSubmitAdd }) => {
  return (
    <form className="flex items-center gap-3" onSubmit={handleSubmitAdd}>
      <input
        ref={addTodoRef}
        id="add-todo"
        name="new-todo"
        type="text"
        required
        autoComplete="off"
        onChange={handleChangeAdd}
        placeholder="Todo title"
        className="focus:outline-none w-full p-2 rounded-md bg-box-bg-color border border-white/10 focus:border-purple-color transition-colors"
      />
      <button
        aria-label="Add Todo"
        title="Add Todo"
        className="rounded-md py-2 px-4 bg-purple-color text-nowrap"
      >
        <i className="fa-solid fa-plus me-2"></i>
        <span>Add</span>
      </button>
    </form>
  )
};

function App() {
  // Initialize todos data:
  const [todos, setTodos] = useState([]);

  // Filter Todos:
  const [filteredTodos, setFilteredTodos] = useState([]);

  // Stored Todos:
  React.useEffect(() => {
    const storedTodos = window.localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
      setFilteredTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save Todos:
  const saveTodos = (todos) => {
    window.localStorage.setItem('todos', JSON.stringify(todos));
  };

  // Todo Title:
  const [todoTitle, setTodoTitle] = useState('');
  // Add Todo Ref:
  const addTodoRef = useRef(null);

  // Handlers:
  const handleChangeAdd = (e) => {
    setTodoTitle(e.target.value);
  }
  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (todoTitle) {
      const newTodo = {
        id: Date.now(),
        title: todoTitle,
        createdAt: new Date().toLocaleString('en', {
          month: 'short',
          weekday: 'long',
          day: 'numeric',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit'
        }),
        completed: false,
      };
      setFilteredTodos(prevTodos => {
        const todosData = [newTodo, ...prevTodos];
        saveTodos(todosData);
        return todosData;
      });
      setTodoTitle('');
      addTodoRef.current.value = '';
    }
  };
  const handleCompleteTodo = (todoId) => {
    setFilteredTodos(prevTodos => {
      const todosUpdated = prevTodos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t);
      saveTodos(todosUpdated);
      return todosUpdated;
    });
    setTodos(prevTodos => {
      const todosUpdated = prevTodos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t);
      return todosUpdated;
    });
  };
  const handleDeleteTodo = (todoId) => {
    setFilteredTodos(prevTodos => {
      const todosUpdated = prevTodos.filter(t => t.id !== todoId);
      saveTodos(todosUpdated);
      return todosUpdated;
    });
    setTodos(prevTodos => {
      const todosUpdated = prevTodos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t);
      return todosUpdated;
    });
  };
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    if (value) {
      const filteredTodos = todos.filter(todo => todo.title.toLowerCase().includes(value.toLowerCase()));
      setFilteredTodos(filteredTodos);
    } else {
      setFilteredTodos(todos);
    }
  };

  return (
    <div className="App flex items-center justify-center min-h-screen px-3 text-white bg-body-bg-color">
      <div className="container md:w-[750px] bg-container-bg-color rounded-md p-3 space-y-3 shadow-md">
        {/* Todos Progress */}
        <TodosProgress todos={todos} />
        {/* Add Todo */}
        <AddTodo addTodoRef={addTodoRef} handleChangeAdd={handleChangeAdd} handleSubmitAdd={handleSubmitAdd} />
        {/* Todos Search */}
        <form onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            id="search"
            onChange={handleChangeSearch}
            name="search"
            placeholder="Search your todos..."
            className="w-full px-3 py-2 rounded-md bg-box-bg-color focus:outline-none border border-white/10 focus:border-purple-color transition-colors"
          />
        </form>
        {/* Todos */}
        <div className="todos space-y-3 max-h-[400px] overflow-y-auto">
          {filteredTodos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              handleCompleteTodo={() => handleCompleteTodo(todo.id)}
              handleDeleteTodo={() => handleDeleteTodo(todo.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;