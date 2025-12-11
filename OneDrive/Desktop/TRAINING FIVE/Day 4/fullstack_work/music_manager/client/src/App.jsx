import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

import Profile from "./Profile";
import Search from "./Search";

function App() {
  // AUTH STATES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken] = useState("");

  // MUSIC STATES
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [year, setYear] = useState("");
  const [musicList, setMusicList] = useState([]);

  // UPDATE STATES
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ------------------------------------
  // CHECK LOGIN ON LOAD
  // ------------------------------------
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      setIsLogin(true);
      fetchMusic(t);
    }
  }, []);

  // ------------------------------------
  // FETCH MUSIC LIST
  // ------------------------------------
  const fetchMusic = async (t) => {
    try {
      const res = await axios.get("http://localhost:3000/api/music", {
        headers: { Authorization: t },
      });
      setMusicList(res.data);
    } catch (err) {
      console.log("Fetch music error:", err);
    }
  };

  // ------------------------------------
  // REGISTER
  // ------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/register", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setIsLogin(true);
      fetchMusic(res.data.token);
      alert("Registered successfully!");
    } catch (err) {
      console.log("Register error:", err);
      alert("Registration failed!");
    }
  };

  // ------------------------------------
  // LOGIN
  // ------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setIsLogin(true);
      fetchMusic(res.data.token);
    } catch (err) {
      console.log("Login error:", err);
      alert("Invalid credentials!");
    }
  };

  // ------------------------------------
  // LOGOUT
  // ------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    setMusicList([]);
    setToken("");
  };

  // ------------------------------------
  // ADD MUSIC
  // ------------------------------------
  const handleAddMusic = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/api/music",
        { name, artist, album, year },
        { headers: { Authorization: token } }
      );

      setName("");
      setArtist("");
      setAlbum("");
      setYear("");

      fetchMusic(token);
    } catch (err) {
      console.log("Add music error:", err);
    }
  };

  // ------------------------------------
  // START EDITING
  // ------------------------------------
  const handleEdit = (music) => {
    setEditId(music._id);
    setName(music.name);
    setArtist(music.artist);
    setAlbum(music.album);
    setYear(music.year);
    setIsEditing(true);
  };

  // ------------------------------------
  // UPDATE MUSIC
  // ------------------------------------
  const handleUpdateMusic = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:3000/api/music/${editId}`,
        { name, artist, album, year },
        { headers: { Authorization: token } }
      );

      setName("");
      setArtist("");
      setAlbum("");
      setYear("");
      setEditId(null);
      setIsEditing(false);

      fetchMusic(token);
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // ------------------------------------
  // DELETE MUSIC
  // ------------------------------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/music/${id}`, {
        headers: { Authorization: token },
      });
      fetchMusic(token);
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ------------------------------------
  // LOGIN + REGISTER PAGE
  // ------------------------------------
  if (!isLogin) {
    return (
      <div className="container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // ------------------------------------
  // MUSIC DASHBOARD PAGE
  // ------------------------------------
  const Dashboard = () => (
    <div className="container">
      <h2>Music Manager 🎵</h2>
      <nav className="nav-bar">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/search">Search</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h3>{isEditing ? "Update Music" : "Add Music"}</h3>
      <form onSubmit={isEditing ? handleUpdateMusic : handleAddMusic}>
        <input
          type="text"
          placeholder="Song Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          type="text"
          placeholder="Album"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button type="submit">
          {isEditing ? "Update Music" : "Add Music"}
        </button>
      </form>

      <h3>Music List 🎶</h3>
      <ul>
        {musicList.map((m) => (
          <li key={m._id}>
            <b>{m.name}</b> — {m.artist} — {m.album} ({m.year})
            <button
              style={{ marginLeft: "10px", background: "blue", color: "white" }}
              onClick={() => handleEdit(m)}
            >
              Edit
            </button>
            <button
              style={{ marginLeft: "10px", color: "white", background: "red" }}
              onClick={() => handleDelete(m._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  // ------------------------------------
  // RETURN ROUTES
  // ------------------------------------
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={token ? <Profile token={token} /> : <Navigate to="/" />} />
        <Route path="/search" element={token ? <Search token={token} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
