import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5001/api/v1";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [msg, setMsg] = useState("");
  const [tasks, setTasks] = useState([]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
  });

  const register = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, {
        ...user,
        role: "user",
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Register failed");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: user.email,
        password: user.password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setMsg("Login successful");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const createTask = async () => {
    try {
      await axios.post(`${API}/tasks`, task, headers);
      setMsg("Task created");
      getTasks();
    } catch (err) {
      setMsg(err.response?.data?.message || "Task creation failed");
    }
  };

  const getTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, headers);
      setTasks(res.data.tasks);
      setMsg("Tasks loaded");
    } catch (err) {
      setMsg(err.response?.data?.message || "Could not load tasks");
    }
  };

  const updateTask = async (id) => {
    try {
      await axios.put(
        `${API}/tasks/${id}`,
        { status: "Completed", priority: "High" },
        headers
      );
      setMsg("Task updated");
      getTasks();
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, headers);
      setMsg("Task deleted");
      getTasks();
    } catch (err) {
      setMsg(err.response?.data?.message || "Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setTasks([]);
    setMsg("Logged out");
  };

  return (
    <div className="app">
      <h1>SecureTask Dashboard</h1>

      {msg && <p className="message">{msg}</p>}

      {!token ? (
        <div className="card">
          <h2>Register / Login</h2>

          <input
            placeholder="Name"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <input
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>

          <div className="card">
            <h2>Create Task</h2>

            <input
              placeholder="Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />

            <input
              placeholder="Description"
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
            />

            <select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <button onClick={createTask}>Create Task</button>
            <button onClick={getTasks}>Load Tasks</button>
          </div>

          {tasks.map((t) => (
            <div className="task" key={t._id}>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <p>Status: {t.status}</p>
              <p>Priority: {t.priority}</p>

              <button onClick={() => updateTask(t._id)}>Mark Completed</button>
              <button onClick={() => deleteTask(t._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;