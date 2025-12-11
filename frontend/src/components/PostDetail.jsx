// src/components/PostDetail.jsx

import { useEffect, useState } from "react";
import "../styles.css";

const API_BASE = process.env.REACT_APP_API_BASE ?? "http://localhost:5000";

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

// Mock comments API
const commentsDb = {};

async function getComments(postId) {
  await new Promise(r => setTimeout(r, 300));
  return commentsDb[postId] || [];
}

async function addComment(postId, commentData) {
  await new Promise(r => setTimeout(r, 200));
  if (!commentsDb[postId]) {
    commentsDb[postId] = [];
  }
  const newComment = {
    id: Date.now(),
    author: commentData.author,
    text: commentData.text,
    createdAt: new Date().toISOString()
  };
  commentsDb[postId].unshift(newComment);
  return newComment;
}

export default function PostDetail({ navigate, postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingCmt, setLoadingCmt] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getHomePosts();
      if (cancelled) return;

      const found = data.find((p) => String(p.id) === String(postId));
      setPost(found || null);
      setLoading(false);
    }

    load();
    return () => (cancelled = true);
  }, [postId]);

  // Load comments
  useEffect(() => {
    let cancelled = false;

    async function loadCmt() {
      setLoadingCmt(true);
      const list = await getComments(postId);
      if (!cancelled) {
        setComments(list);
        setLoadingCmt(false);
      }
    }

    loadCmt();
    return () => (cancelled = true);
  }, [postId]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    const newCmt = await addComment(postId, {
      author: "Bạn",
      text: commentText
    });

    setComments(prev => [newCmt, ...prev]);
    setCommentText("");
  };

  if (loading) return <div className="post-detail-root"><div className="post-loading">Đang tải bài viết…</div></div>;
  if (!post) return <div className="post-detail-root"><div className="post-notfound">Không tìm thấy bài viết.</div></div>;

  return (
    <div className="post-detail-root">
      <header className="post-topbar">
        <button className="post-btn-back" onClick={() => navigate("/")}>
          ← Trở lại
        </button>
      </header>

      <main className="post-container">
        <h1 className="post-title">{post.title}</h1>

        <div className="post-meta">
          <div className="post-author">
            <div className="post-avatar">{post.avatar || "☕"}</div>
            <div>
              <div className="post-author-name">{post.author}</div>
              <div className="post-date">{post.createdAt}</div>
            </div>
          </div>
          <span className="post-type-tag">
            {post.type === "video" ? "Video" : post.type === "image" ? "Hình ảnh" : "Bài viết"}
          </span>
        </div>

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
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )}

        <footer className="post-footer">
          <span>💬 {comments.length ?? 0}</span>
        </footer>

        {/* COMMENTS SECTION */}
        <section className="post-comments">
          <h2 className="post-comments-title">Bình luận</h2>

          <div className="post-comment-box">
            <input
              className="post-comment-input"
              placeholder="Viết bình luận..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
            />
            <button className="post-comment-btn" onClick={handleSendComment}>
              Gửi
            </button>
          </div>

          {loadingCmt ? (
            <div className="post-loading">Đang tải bình luận…</div>
          ) : comments.length === 0 ? (
            <div className="post-nocmt">Chưa có bình luận nào.</div>
          ) : (
            <div className="post-comment-list">
              {comments.map((c) => (
                <div className="post-comment-item" key={c.id}>
                  <div className="post-comment-author">{c.author}</div>
                  <div className="post-comment-text">{c.text}</div>
                  <div className="post-comment-time">
                    {new Date(c.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}