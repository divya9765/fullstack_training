import React, { useState } from "react";
import axios from "axios";

export default function Search({ token }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/music/search?query=${query}`, {
        headers: { Authorization: token }
      });
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h2>Search Music 🎵</h2>
      <input
        placeholder="Search by name, artist, or album"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map(m => (
          <li key={m._id}>
            <b>{m.name}</b> — {m.artist} — {m.album} ({m.year})
          </li>
        ))}
      </ul>
    </div>
  );
}
