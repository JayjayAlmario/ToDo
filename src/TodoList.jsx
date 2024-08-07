import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDate, setEditingDate] = useState("");

  useEffect(() => {
    document.title = "To-Do List";
  }, []);
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add task
  const handleAddTask = () => {
    if (newTask.trim() && newDate) {
      setTasks([...tasks, { text: newTask, date: newDate, done: false }]);
      setNewTask("");
      setNewDate("");
    }
  };

  // Handle Enter key press for adding a task
  const handleKeyDownAddTask = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  // Delete task with confirmation
  const handleDeleteTask = (index) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  // Edit task
  const handleEditTask = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
    setEditingDate(tasks[index].date);
  };

  // Save task
  const handleSaveEdit = () => {
    if (editingText.trim() && editingDate) {
      const updatedTasks = tasks.map((task, index) => (
        index === editingIndex ? { ...task, text: editingText, date: editingDate } : task
      ));
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditingText("");
      setEditingDate("");
    }
  };

  // Handle Enter key press for saving an edited task
  const handleKeyDownSaveEdit = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }
  };

  // Mark task as done
  const handleToggleDone = (index) => {
    const updatedTasks = tasks.map((task, i) => (
      i === index ? { ...task, done: !task.done } : task
    ));
    setTasks(updatedTasks);
  };

  // Mark all tasks as done or not done
  const handleMarkAllDone = () => {
    const allDone = tasks.every(task => task.done);
    const updatedTasks = tasks.map(task => ({ ...task, done: !allDone }));
    setTasks(updatedTasks);
  };

  // Clear all task(s)
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTasks([]);
    }
  };

  return (
    <div className="todo-container">
      <a title='This is a Title'>
        <h1>TO-DO LIST</h1>
      </a>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDownAddTask}
          placeholder="What's on your mind?"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          onKeyDown={handleKeyDownAddTask}
        />
        <a title="Add Task">
          <button onClick={handleAddTask}>Add</button>
        </a>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={task.done ? "done" : ""}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={handleKeyDownSaveEdit}
                />
                <input
                  type="date"
                  value={editingDate}
                  onChange={(e) => setEditingDate(e.target.value)}
                  onKeyDown={handleKeyDownSaveEdit}
                />
                <a title="Save Task">
                  <button onClick={handleSaveEdit}>Save</button>
                </a>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggleDone(index)}
                />
                <span onClick={() => handleToggleDone(index)}>{task.text} - {task.date}</span>
                <div>
                  <a title="Edit Task">
                    <button onClick={() => handleEditTask(index)}>Edit</button>
                  </a>
                  <a title="Delete Task">
                    <button onClick={() => handleDeleteTask(index)}>Delete</button>
                  </a>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {tasks.length > 0 && (
        <div className="buttons-container">
          <a title="Mark All Tasks as Done">
            <button className="mark-all-done-button" onClick={handleMarkAllDone}>
              {tasks.every(task => task.done) ? "Mark All as Undone" : "Mark All as Done"}
            </button>
          </a>
          <a title="Delete All Existing Task(s)">
            <button className="clear-all-button" onClick={handleClearAll}>Delete All</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default TodoList;
