// src/App.js

import { useEffect, useState } from "react";
import "./styles.css";

import Auth from "./components/Auth";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import Editor from "./components/Editor";
import Schedule from "./components/Schedule";
import Campaign from "./components/Campaign";
import SEO from "./components/SEO";
import Profile from "./components/Profile";
import Livestream from "./components/Livestream";
import ArticleDetail from "./components/ArticleDetail";

function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const userJson = localStorage.getItem("user");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    if (!getCurrentUser()) {
      window.history.replaceState({}, "", "/auth");
      setPath("/auth");
    }
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

  if (!user) {
    return <Auth navigate={navigate} />;
  }

  if (path === "/" || path === "/home") {
    return <Home user={user} navigate={navigate} />;
  }

  if (path === "/user") {
    return <UserProfile navigate={navigate} />;
  }

  if (path === "/dashboard") {
    return <Dashboard navigate={navigate} />;
  }

  if (path.startsWith("/article/")) {
    const id = path.split("/")[2];
    return <ArticleDetail navigate={navigate} articleId={id} />;
  }

  if (path === "/profile") return <Profile navigate={navigate} />;
  if (path === "/livestream") return <Livestream navigate={navigate} />;
  if (path === "/campaign") return <Campaign navigate={navigate} />;
  if (path === "/schedule") return <Schedule navigate={navigate} />;
  if (path === "/editor") return <Editor navigate={navigate} />;
  if (path === "/seo") return <SEO navigate={navigate} />;

  return <Home user={user} navigate={navigate} />;
}

export default App;