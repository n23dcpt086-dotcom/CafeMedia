// /src/components/Home.jsx

import { useEffect, useState } from "react";
import "../styles.css";

const API_BASE = process.env.REACT_APP_API_BASE ?? "http://localhost:5000/api";

async function getHomePosts() {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default function Home({ user, navigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getHomePosts();
        if (!cancelled) {
          setPosts(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const goDashboard = () => {
    if (user && user.role === "admin" && typeof navigate === "function") {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (typeof navigate === "function") navigate("/auth");
    else window.location.href = "/auth";
  };

  return (
    <div className="home-root">
      {/* Top bar */}
      <header className="home-topbar">
        <div className="home-brand">
          <div className="home-logo">☕</div>
          <div>
            <strong>Café Media</strong>
            <div className="home-sub">Bảng tin khách hàng</div>
          </div>
        </div>

        <div className="home-top-actions">
          {user && (
            <div className="home-user-info">
              <span className="home-avatar">{user.name?.[0] || "U"}</span>
              <div className="home-user-meta">
                <div className="home-user-name">{user.name}</div>
                <div className="home-user-role">
                  {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                </div>
              </div>
            </div>
          )}

          {user?.role === "user" && (
            <button
              className="home-btn-secondary"
              onClick={() => navigate("/user")}
            >
              Tài khoản của tôi
            </button>
          )}

          {user?.role === "admin" && (
            <button className="home-btn-secondary" onClick={goDashboard}>
              Mở Dashboard
            </button>
          )}

          <button className="home-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="home-main">
        <section className="home-hero-card">
          <div>
            <h1>Chào mừng đến Café Media</h1>
            <p>
              Cập nhật các câu chuyện, hình ảnh và video mới nhất từ quán cà phê.
              Khám phá nội dung mới nhất được chia sẻ bởi đội ngũ của chúng tôi.
            </p>
          </div>
        </section>

        <section className="home-feed">
          {loading ? (
            <div className="home-loading">Đang tải bài viết…</div>
          ) : posts.length === 0 ? (
            <div className="home-empty">Chưa có bài viết nào được xuất bản.</div>
          ) : (
            posts.map((p) => (
              <PostCard key={p.id} post={p} onClick={() => navigate(`/post/${p.id}`)} />
            ))
          )}
        </section>
      </main>
    </div>
  );
}

function PostCard({ post, onClick }) {
  return (
    <article className="post-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <header className="post-header">
        <div className="post-author">
          <div className="post-avatar">{post.avatar || "☕"}</div>
          <div>
            <div className="post-author-name">{post.author}</div>
            <div className="post-meta">{post.createdAt}</div>
          </div>
        </div>
        <span className="post-type">
          {post.type === "video"
            ? "Video"
            : post.type === "image"
              ? "Hình ảnh"
              : "Bài viết"}
        </span>
      </header>

      <h2 className="post-title">{post.title}</h2>
      {post.body && <p className="post-body">{post.body}</p>}

      {post.type === "image" && post.imageUrl && (
        <div className="post-media">
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}

      {post.type === "video" && post.videoUrl && (
        <div className="post-media post-media-video">
          {post.videoUrl.startsWith('data:video') ? (
            <video controls style={{ width: "100%", maxHeight: "500px" }}>
              <source src={post.videoUrl} type="video/mp4" />
              Trình duyệt không hỗ trợ video.
            </video>
          ) : (
            <iframe
              src={post.videoUrl}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                     gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      )}

      <footer className="post-footer">
        <span>💬 {post.stats?.comments ?? 0}</span>
      </footer>
    </article>
  );
}