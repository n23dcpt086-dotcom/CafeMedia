// src/components/Editor.jsx
import { useState, useEffect, useRef } from "react";
import "../styles.css";

const API_BASE = "http://localhost:5000/api";
const TOKEN_KEY = "token";
const DRAFT_KEY = "editor-draft-v1";

async function fetchMyPosts() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return [];
    const res = await fetch(`${API_BASE}/posts/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    return res.json();
}

export default function Editor() {
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [myPosts, setMyPosts] = useState([]);
    const [currentArticleId, setCurrentArticleId] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const [publishedAt, setPublishedAt] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const editorRef = useRef(null);

    const loadDraft = () => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.id) setCurrentArticleId(data.id);
            if (data.title) setTitle(data.title);
            if (data.content && editorRef.current) editorRef.current.innerHTML = data.content;
            if (data.tag) setTag(data.tag);
            if (data.imageUrl) setImageUrl(data.imageUrl);
            if (data.imageFile) setImageFile(data.imageFile);
            if (data.videoUrl) setVideoUrl(data.videoUrl);
            if (data.videoFile) setVideoFile(data.videoFile);
            if (data.publishedAt) setPublishedAt(data.publishedAt);
        } catch { }
    };

    const loadMyPosts = async () => {
        const list = await fetchMyPosts();
        setMyPosts(list);
    };

    useEffect(() => {
        loadDraft();
        loadMyPosts();
    }, []);

    const clearForm = () => {
        setCurrentArticleId(null);
        setTitle("");
        setTag("");
        setImageUrl("");
        setImageFile("");
        setVideoUrl("");
        setVideoFile("");
        setPublishedAt("");
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
        }
        localStorage.removeItem(DRAFT_KEY);
        setMessage({ type: "", text: "" });
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSchedule = async () => {
        if (!title.trim()) {
            setMessage({ type: "error", text: "Tiêu đề không được để trống" });
            return;
        }
        
        const body = editorRef.current ? editorRef.current.innerHTML : "";
        if (!body.trim()) {
            setMessage({ type: "error", text: "Nội dung không được để trống" });
            return;
        }
        
        if (!tag.trim()) {
            setMessage({ type: "error", text: "Thẻ (Tag) không được để trống" });
            return;
        }

        if (!publishedAt) {
            setMessage({ type: "error", text: "Ngày lên lịch không được để trống" });
            return;
        }

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                setMessage({ type: "error", text: "Vui lòng đăng nhập" });
                return;
            }

            const payload = {
                id: currentArticleId,
                title,
                body,
                tag,
                imageUrl,
                imageFile,
                videoUrl,
                videoFile,
                status: "draft",
                publishedAt
            };

            const res = await fetch(`${API_BASE}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: data.message || "Có lỗi xảy ra" });
                return;
            }

            setMessage({ type: "success", text: data.message });
            clearForm();
            await loadMyPosts();
            setTimeout(() => {
                setMessage({ type: "", text: "" });
            }, 3000);

        } catch (error) {
            console.error("Error scheduling post:", error);
            setMessage({ type: "error", text: "Lỗi kết nối server" });
        }
    };

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-logo">✍️</div>
                    <span><strong>Café Media Portal</strong></span>
                </div>

                <nav className="nav">
                    <a href="/dashboard" className="nav-link">📊 Dashboard</a>
                    <a href="/editor" className="nav-link active">📝 Nội dung</a>
                    <a href="/schedule" className="nav-link">📅 Lịch xuất bản</a>
                    <a href="/livestream" className="nav-link">🎥 Livestream</a>
                    <a href="/campaign" className="nav-link">📢 Chiến dịch</a>
                    <a href="/seo" className="nav-link">⚙️ SEO & Hiệu năng</a>
                    <a href="/profile" className="nav-link">👤 Người dùng</a>
                </nav>
            </aside>

            <main className="main">
                <div className="content editor-2col">
                    <section className="editor-left">
                        {message.text && (
                            <div
                                style={{
                                    padding: "0.75rem",
                                    marginBottom: "1rem",
                                    borderRadius: "8px",
                                    backgroundColor: message.type === "error" ? "#fee" : "#efe",
                                    color: message.type === "error" ? "#c33" : "#363",
                                    border: `1px solid ${message.type === "error" ? "#fcc" : "#cfc"}`
                                }}
                            >
                                {message.text}
                            </div>
                        )}

                        <input
                            className="title-input"
                            placeholder="Tiêu đề bài viết"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="card" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
                            <div className="row">
                                <label className="label">Thẻ (Tag) <span style={{color: "red"}}>*</span></label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ví dụ: Cà Phê Mùa Đông, Ưu Đãi, Combo Sáng"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                />
                                <small style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                                    Gợi ý: Cà Phê Mùa Đông, Ưu Đãi Giáng Sinh, Combo Sáng, Món Mới, Khuyến Mãi
                                </small>
                            </div>
                        </div>

                        <div className="card" style={{ marginBottom: "1rem" }}>
                            <div className="row" style={{ marginBottom: "1rem" }}>
                                <label className="label">Ngày lên lịch <span style={{color: "red"}}>*</span></label>
                                <input
                                    type="datetime-local"
                                    className="input"
                                    value={publishedAt}
                                    onChange={(e) => setPublishedAt(e.target.value)}
                                    style={{ maxWidth: "300px" }}
                                />
                                <small style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                                    Chọn ngày và giờ bài viết sẽ được xuất bản
                                </small>
                            </div>
                        </div>

                        <div className="card" style={{ marginBottom: "1rem" }}>
                            <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem", fontWeight: "700" }}>
                                Media
                            </h3>

                            <div className="row" style={{ marginBottom: "0.75rem" }}>
                                <label className="label">Link ảnh (URL)</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="https://example.com/link-to-image"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </div>

                            <div className="row" style={{ marginBottom: "0.75rem" }}>
                                <label className="label">File ảnh (Upload)</label>
                                <input
                                    type="file"
                                    className="input"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                />
                                {imageFile && (
                                    <img
                                        src={imageFile}
                                        alt="Preview"
                                        style={{
                                            marginTop: "0.5rem",
                                            maxWidth: "100%",
                                            maxHeight: "200px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border)"
                                        }}
                                    />
                                )}
                            </div>

                            <div className="row" style={{ marginBottom: "0.75rem" }}>
                                <label className="label">Link video (URL)</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="https://example.com/link-to-video"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                            </div>

                            <div className="row">
                                <label className="label">File video (Upload)</label>
                                <input
                                    type="file"
                                    className="input"
                                    accept="video/*"
                                    onChange={handleVideoFileChange}
                                />
                                {videoFile && (
                                    <video
                                        src={videoFile}
                                        controls
                                        style={{
                                            marginTop: "0.5rem",
                                            width: "100%",
                                            maxHeight: "200px",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px"
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <article
                            className="editor"
                            ref={editorRef}
                            contentEditable="true"
                            suppressContentEditableWarning
                        ></article>

                    </section>

                    <aside className="editor-side">
                        <section className="card" style={{ padding: "1rem", maxHeight: "220px", overflowY: "auto" }}>
                            <h3>Bài viết của bạn</h3>

                            {myPosts.length === 0 && <div>Chưa có bài viết.</div>}

                            {myPosts.map((p) => (
                                <div
                                    key={p.id}
                                    className="mypost-item"
                                    onClick={() => {
                                        setCurrentArticleId(p.id);
                                        setTitle(p.title || "");
                                        setTag(p.tag || "");
                                        setImageUrl(p.image_url || "");
                                        setImageFile(p.imageBase64 || "");
                                        setVideoUrl(p.video_url || "");
                                        setVideoFile(p.videoBase64 || "");
                                        setPublishedAt(p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : "");
                                        if (editorRef.current) {
                                            editorRef.current.innerHTML = p.body || "";
                                        }
                                    }}
                                >
                                    <strong>{p.title}</strong>
                                    <div className="mypost-meta">
                                        {p.status} • {new Date(p.published_at).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            ))}
                        </section>
                        <div className="approval">
                            <button className="btn primary" onClick={handleSchedule}>Lên lịch</button>
                            <button className="btn" onClick={clearForm}>Soạn bài mới</button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}