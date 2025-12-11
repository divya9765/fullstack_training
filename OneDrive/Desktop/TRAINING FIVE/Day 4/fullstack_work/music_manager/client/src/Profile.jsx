import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Profile({ token }) {
  const [user, setUser] = useState({ username: "" });

  useEffect(() => {
    // Example: fetch user data
    axios.get("http://localhost:3000/api/profile", { headers: { Authorization: token } })
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, [token]);

  return (
    <div className="container">
      <h2>Profile Page</h2>
      <p><b>Username:</b> {user.username}</p>
      {/* You can add update username/password form here */}
    </div>
  );
}
