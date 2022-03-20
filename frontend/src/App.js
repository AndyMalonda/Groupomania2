import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import LoggedInNav from "./components/LoggedInNav";
import LoggedOutNav from "./components/LoggedOutNav";
import Post from "./components/Post";
import Login from "./components/Login";
import Registration from "./components/Registration";
import "./bootstrap.min.css";
import { AuthContext } from "./contexts/auth-context";
import { useState, useEffect } from "react";
import axios from "axios";

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
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        {authState.status ? <LoggedInNav /> : <LoggedOutNav />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/posts" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/createpost" element={<CreatePost />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
