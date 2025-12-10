// src/App.js
import { useEffect, useState } from "react";
import "./styles.css";

import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Editor from "./components/Editor";
import Schedule from "./components/Schedule";
import Campaign from "./components/Campaign";
import SEO from "./components/SEO";
import Profile from "./components/Profile";
import Livestream from "./components/Livestream";
import { getCurrentUser } from "./api/authMock";

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    const handlePop = () => {
      setPath(window.location.pathname);
      setUser(getCurrentUser());
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (to) => {

    window.history.pushState({}, "", to);
    setPath(to);
    setUser(getCurrentUser());
  };

  if (!user && path !== "/login") {
    return <Login navigate={navigate} />;
  }

  if (path === "/login") {
    return <Login navigate={navigate} />;
  }

  if (path === "/dashboard") {
    return <Dashboard navigate={navigate} />;
  }

  if (path === "/" || path === "/home") {
    return <Home user={user} navigate={navigate} />;
  }

  if (path === "/profile") {
    return <Profile navigate={navigate} />;
  }

  if (path === "/livestream") {
    return <Livestream navigate={navigate} />;
  }

  if (path === "/campaign") {
    return <Campaign navigate={navigate} />;
  }

  if (path === "/schedule") {
    return <Schedule navigate={navigate} />;
  }

  if (path === "/editor") {
    return <Editor navigate={navigate} />;
  }

  if (path === "/seo") {
    return <SEO navigate={navigate} />;
  }

  return <Home user={user} navigate={navigate} />;
}

export default App;