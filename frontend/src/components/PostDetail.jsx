// src/components/PostDetail.jsx

import { useEffect, useState } from "react";
import "../styles.css";

const API_BASE = "http://localhost:5000/api";

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

async function getComments(postId) {
  try {
    const res = await fetch(`${API_BASE}/comments/${postId}`);
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

async function addComment(postId, text) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Chưa đăng nhập");
    }

    const res = await fetch(`${API_BASE}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ postId, text })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Lỗi khi thêm bình luận");
    }

    return res.json();
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

async function deleteComment(commentId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Chưa đăng nhập");
    }

    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Lỗi khi xóa bình luận");
    }

    return res.json();
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

export default function PostDetail({ navigate, postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingCmt, setLoadingCmt] = useState(true);
  const [sendingCmt, setSendingCmt] = useState(false);

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
    if (sendingCmt) return;
    setSendingCmt(true);
    try {
      const newCmt = await addComment(postId, commentText);
      setComments(prev => [newCmt, ...prev]);
      setCommentText("");
    } catch (error) {
      alert(error.message || "Lỗi khi gửi bình luận");
    } finally {
      setSendingCmt(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      alert(error.message || "Lỗi khi xóa bình luận");
    }
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
          <span>💬 {comments.length}</span>
        </footer>

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
              disabled={sendingCmt}
            />
            <button
              className="post-comment-btn"
              onClick={handleSendComment}
              disabled={sendingCmt || !commentText.trim()}
            >
              {sendingCmt ? "Đang gửi..." : "Gửi"}
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
                  <div className="post-comment-header">
                    <div className="post-comment-author-info">
                      <span className="post-comment-avatar">{c.avatar || "👤"}</span>
                      <span className="post-comment-author">{c.author}</span>
                    </div>
                    <button
                      className="post-comment-delete"
                      onClick={() => handleDeleteComment(c.id)}
                      title="Xóa bình luận"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="post-comment-text">{c.text}</div>
                  <div className="post-comment-time">
                    {new Date(c.createdAt).toLocaleString("vi-VN", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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