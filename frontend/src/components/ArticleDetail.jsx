import { useEffect, useState } from "react";
import "../styles.css";
import { getHomePosts } from "../api/mock";
import { getComments, addComment } from "../api/commentMock";

export default function ArticleDetail({ navigate, articleId }) {
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

      const found = data.find((p) => String(p.id) === String(articleId));
      setPost(found || null);
      setLoading(false);
    }

    load();
    return () => (cancelled = true);
  }, [articleId]);

  // Load comments
  useEffect(() => {
    let cancelled = false;

    async function loadCmt() {
      setLoadingCmt(true);
      const list = await getComments(articleId);
      if (!cancelled) {
        setComments(list);
        setLoadingCmt(false);
      }
    }

    loadCmt();
    return () => (cancelled = true);
  }, [articleId]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    const newCmt = await addComment(articleId, {
      author: "Bạn",
      text: commentText
    });

    setComments(prev => [newCmt, ...prev]);
    setCommentText("");
  };

  if (loading) return <div className="article-detail-root"><div className="article-loading">Đang tải bài viết…</div></div>;
  if (!post) return <div className="article-detail-root"><div className="article-notfound">Không tìm thấy bài viết.</div></div>;

  return (
    <div className="article-detail-root">
      <header className="article-topbar">
        <button className="article-btn-back" onClick={() => navigate("/")}>
          ← Trở lại
        </button>
      </header>

      <main className="article-container">
        <h1 className="article-title">{post.title}</h1>

        <div className="article-meta">
          <div className="article-author">
            <div className="article-avatar">{post.avatar || "☕"}</div>
            <div>
              <div className="article-author-name">{post.author}</div>
              <div className="article-date">{post.createdAt}</div>
            </div>
          </div>
          <span className="article-type-tag">
            {post.type === "video" ? "Video" : post.type === "image" ? "Hình ảnh" : "Bài viết"}
          </span>
        </div>

        {post.body && <p className="article-body">{post.body}</p>}

        {post.type === "image" && post.imageUrl && (
          <div className="article-media">
            <img src={post.imageUrl} alt={post.title} />
          </div>
        )}

        {post.type === "video" && post.videoUrl && (
          <div className="article-media article-media-video">
            <iframe
              src={post.videoUrl}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <footer className="article-footer">
          <span>👍 {post.stats?.likes ?? 0}</span>
          <span>💬 {comments.length}</span>
        </footer>

        {/* COMMENTS SECTION */}
        <section className="article-comments">
          <h2 className="article-comments-title">Bình luận</h2>

          <div className="article-comment-box">
            <input
              className="article-comment-input"
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
            <button className="article-comment-btn" onClick={handleSendComment}>
              Gửi
            </button>
          </div>

          {loadingCmt ? (
            <div className="article-loading">Đang tải bình luận…</div>
          ) : comments.length === 0 ? (
            <div className="article-nocmt">Chưa có bình luận nào.</div>
          ) : (
            <div className="article-comment-list">
              {comments.map((c) => (
                <div className="article-comment-item" key={c.id}>
                  <div className="article-comment-author">{c.author}</div>
                  <div className="article-comment-text">{c.text}</div>
                  <div className="article-comment-time">
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