// Scripts
import { AuthContext } from "./contexts/auth-context";
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";

import Post from "./components/Post";
import Login from "./components/Login";
import Register from "./components/Register";
import PageNotFound from "./components/PageNotFound";
import Navbar from "./components/Navbar";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3006/users/auth", {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, [authState]);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        {/* {authState.status ? <LoggedInNav /> : <LoggedOutNav />} */}
        <Navbar></Navbar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
