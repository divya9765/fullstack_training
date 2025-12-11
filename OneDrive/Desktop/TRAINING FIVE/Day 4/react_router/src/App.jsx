import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import BookList from "./BookList";
import "./App.css";

function App() {
  return (
    <BrowserRouter>

      {/* NAVBAR */}
      <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
        <Link to="/">Home</Link>
        <Link to="/booklist">Book List</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booklist" element={<BookList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
