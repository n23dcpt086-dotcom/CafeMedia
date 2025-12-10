// src/components/Editor.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import "../styles.css";

// Import API functions
const DRAFT_KEY = "editor-draft-v1";

// Mock API functions (bạn có thể thay bằng API thực)
const saveDraftApi = async (data) => {
    await new Promise(r => setTimeout(r, 300));
    const id = data.id || `article-${Date.now()}`;
    return { ...data, id, savedAt: new Date().toISOString() };
};

const submitArticleApi = async (id, note) => {
    await new Promise(r => setTimeout(r, 300));
    return { id, status: "pending", note };
};

const getCommentsApi = async (articleId) => {
    await new Promise(r => setTimeout(r, 200));
    return [
        {
            id: 1,
            author: "@Trần Chi",
            text: "Thêm ảnh minh hoạ và ghi thời gian ủ: 16h là hợp lý.",
            target: "đoạn 'cold brew'",
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            author: "@Ngọc Linh",
            text: "SEO title ok. Thêm từ khoá 'công thức cà phê mùa đông'.",
            target: "tiêu đề",
            createdAt: new Date().toISOString()
        }
    ];
};

const addCommentApi = async (articleId, comment) => {
    await new Promise(r => setTimeout(r, 200));
    return {
        id: Date.now(),
        ...comment,
        createdAt: new Date().toISOString()
    };
};

export default function Editor({ navigate }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Công thức");
    const [selectedTags, setSelectedTags] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [currentArticleId, setCurrentArticleId] = useState(null);

    // Drawer states
    const [drawerExpanded, setDrawerExpanded] = useState(false);
    const [drawerCollapsed, setDrawerCollapsed] = useState(false);

    const editorRef = useRef(null);

    const availableTags = ["#CàPhêMùaĐông", "#ƯuĐãiGiángSinh", "#ComboSáng"];

    const loadDraft = () => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);

            if (data.id) setCurrentArticleId(data.id);
            if (data.title) setTitle(data.title);
            if (data.content && editorRef.current) {
                editorRef.current.innerHTML = data.content;
            }
            if (data.category) setCategory(data.category);
            if (Array.isArray(data.tags)) setSelectedTags(data.tags);
        } catch (err) {
            console.warn("Không load được draft:", err);
        }
    };

    const loadComments = useCallback(async () => {
        if (!currentArticleId) return;
        try {
            const list = await getCommentsApi(currentArticleId);
            setComments(list);
        } catch (err) {
            console.warn("Không load được comments:", err);
        }
    }, [currentArticleId]);

    useEffect(() => {
        loadDraft();
        loadComments();
    }, [loadComments]);

    // Toolbar actions
    const applyBlock = (tag) => {
        document.execCommand("formatBlock", false, tag);
        editorRef.current?.focus();
    };

    const applyInline = (cmd, value = null) => {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
    };

    const handleToolbarAction = (action) => {
        switch (action) {
            case "h1":
                applyBlock("H1");
                break;
            case "h2":
                applyBlock("H2");
                break;
            case "bold":
                applyInline("bold");
                break;
            case "italic":
                applyInline("italic");
                break;
            case "list":
                applyInline("insertUnorderedList");
                break;
            case "quote":
                applyBlock("BLOCKQUOTE");
                break;
            case "link": {
                const url = prompt("Nhập đường dẫn (URL):");
                if (url) applyInline("createLink", url);
                break;
            }
            case "image": {
                const url = prompt("Nhập link ảnh (URL):");
                if (url) {
                    const html = `<figure><img src="${url}" alt="" style="max-width:100%;border-radius:12px"/><figcaption style="font-size:0.85rem;color:#6b7280">Chú thích ảnh</figcaption></figure>`;
                    document.execCommand("insertHTML", false, html);
                    editorRef.current?.focus();
                }
                break;
            }
            case "video": {
                const url = prompt("Nhập link video (YouTube, v.v.):");
                if (url) {
                    const html = `<div class="embed" aria-label="Video embed">▶️ Nhúng video: ${url}</div>`;
                    document.execCommand("insertHTML", false, html);
                    editorRef.current?.focus();
                }
                break;
            }
            case "embed": {
                const code = prompt("Nhập mã nhúng (embed code) hoặc link:");
                if (code) {
                    const html = `<div class="embed" aria-label="Embed">${code}</div>`;
                    document.execCommand("insertHTML", false, html);
                    editorRef.current?.focus();
                }
                break;
            }
            default:
                break;
        }
    };

    // Save draft
    const handleSaveDraft = async () => {
        const data = {
            id: currentArticleId || undefined,
            title,
            content: editorRef.current?.innerHTML || "",
            category,
            tags: selectedTags,
            status: "draft",
        };

        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));

        try {
            const saved = await saveDraftApi(data);
            setCurrentArticleId(saved.id);
            localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, id: saved.id }));
            alert("Đã lưu nháp lên server (và localStorage).");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu nháp lên server, tạm thời chỉ lưu localStorage.");
        }
    };

    // Preview
    const handlePreview = () => {
        const content = editorRef.current?.innerHTML || "";
        const titleText = title || "Không có tiêu đề";

        const w = window.open("", "_blank", "width=960,height=600");
        if (!w) {
            alert("Trình duyệt chặn popup, hãy cho phép popup để xem trước.");
            return;
        }

        w.document.write(`
      <!doctype html>
      <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>Xem trước bài viết</title>
        <style>
          body{
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
            padding:24px;
            background:#f8fafc;
            color:#0f172a;
          }
          h1{font-size:28px;margin-bottom:16px;}
          .content{background:#fff;border-radius:12px;padding:16px;line-height:1.7;}
          .content img{max-width:100%;border-radius:12px;}
          .meta{font-size:14px;color:#64748b;margin-bottom:8px;}
        </style>
      </head>
      <body>
        <h1>${titleText}</h1>
        <div class="meta">Bản xem trước (demo, chưa xuất bản)</div>
        <div class="content">${content}</div>
      </body>
      </html>
    `);
        w.document.close();
    };

    // Submit
    const handleSubmit = async () => {
        const content = editorRef.current?.innerHTML.trim() || "";

        if (!title.trim() || !content) {
            alert("Vui lòng điền đầy đủ tiêu đề và nội dung trước khi gửi duyệt.");
            return;
        }

        if (!currentArticleId) {
            try {
                const draft = await saveDraftApi({
                    title,
                    content,
                    category,
                    tags: selectedTags,
                    status: "draft",
                });
                setCurrentArticleId(draft.id);
                localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, id: draft.id }));
            } catch (err) {
                console.error(err);
                alert("Không thể lưu nháp trước khi gửi duyệt. Vui lòng thử lại.");
                return;
            }
        }

        try {
            await submitArticleApi(currentArticleId, { note: "Gửi duyệt từ editor" });
            alert("Đã gửi bài viết lên để duyệt thành công!");
        } catch (err) {
            console.error(err);
            alert("Gửi duyệt thất bại. Vui lòng thử lại sau.");
        }
    };

    // Schedule
    const handleSchedule = () => {
        window.location.href = "/schedule.html?from=editor";
    };

    // Tag toggle
    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Comment
    const handleSendComment = async () => {
        if (!commentText.trim()) return;

        if (!currentArticleId) {
            alert("Bạn cần lưu nháp hoặc gửi duyệt để tạo bài viết trước khi bình luận.");
            return;
        }

        try {
            const newCmt = await addCommentApi(currentArticleId, {
                author: "Bạn",
                text: commentText,
                target: "",
            });
            setComments(prev => [newCmt, ...prev]);
            setCommentText("");
        } catch (err) {
            console.error(err);
            alert("Không gửi được bình luận. Vui lòng thử lại.");
        }
    };

    return (
        <div className="app">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-logo">✍️</div>
                    <span><strong>Café Media Portal</strong></span>
                </div>

                <nav className="nav">
                    <a href="/dashboard" className="nav-link">📊 <span>Dashboard</span></a>
                    <a
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/editor");
                        }}
                        href="/editor"
                    >
                        📝 <span>Nội dung</span>
                    </a>
                    <a href="/schedule" className="nav-link">📅 <span>Lịch xuất bản</span></a>
                    <a href="/livestream" className="nav-link">🎥 <span>Livestream</span></a>
                    <a href="/campaign" className="nav-link">📢 <span>Chiến dịch</span></a>
                    <a href="/seo" className="nav-link">⚙️ <span>SEO & Hiệu năng</span></a>
                    <a href="/profile" className="nav-link">👤 <span>Người dùng</span></a>
                </nav>

                <div className="spacer" />
                <div className="user">
                    <div className="meta"></div>
                </div>
            </aside>

            {/* Main */}
            <main className="main">
                <div className="topbar">
                    <div className="topbar-inner">
                        <div className="crumbs">Soạn bài</div>
                        <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem" }}>
                            <button className="btn ghost" onClick={handlePreview}>
                                Xem trước
                            </button>
                            <button className="btn" onClick={handleSaveDraft}>
                                Lưu nháp
                            </button>
                            <button className="btn primary" onClick={handleSubmit}>
                                Gửi duyệt
                            </button>
                        </div>
                    </div>
                </div>

                <div className="content">
                    {/* Editor + Approval bar */}
                    <section className="editor-wrap">
                        <input
                            className="title-input"
                            placeholder="Tiêu đề bài viết"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="toolbar" role="toolbar" aria-label="Soạn thảo">
                            <button className="tool" onClick={() => handleToolbarAction("h1")}>H1</button>
                            <button className="tool" onClick={() => handleToolbarAction("h2")}>H2</button>
                            <button className="tool" onClick={() => handleToolbarAction("bold")}>B</button>
                            <button className="tool" onClick={() => handleToolbarAction("italic")}>I</button>
                            <button className="tool" onClick={() => handleToolbarAction("list")}>Danh sách</button>
                            <button className="tool" onClick={() => handleToolbarAction("quote")}>Trích dẫn</button>
                            <button className="tool" onClick={() => handleToolbarAction("link")}>Liên kết</button>
                            <button className="tool" onClick={() => handleToolbarAction("image")}>Ảnh</button>
                            <button className="tool" onClick={() => handleToolbarAction("video")}>Video</button>
                            <button className="tool" onClick={() => handleToolbarAction("embed")}>Embed</button>
                        </div>

                        <article
                            className="editor"
                            ref={editorRef}
                            contentEditable="true"
                            aria-label="Nội dung"
                            suppressContentEditableWarning
                        >
                            <h2>1. Hạt cà phê và tỉ lệ pha</h2>
                            <p>Chọn hạt rang vừa, xay mịn vừa. Tỉ lệ gợi ý 1:15 (cà phê:nước) cho hương vị cân bằng.</p>
                            <h2>2. Công thức cold brew cơ bản</h2>
                            <p>Ủ lạnh 12–18 giờ, lọc kỹ, thêm sữa hoặc syrup theo khẩu vị.</p>
                            <div className="embed" aria-label="YouTube embed">
                                ▶️ Nhúng YouTube: https://youtube.com/watch?v=dQw4w9WgXcQ
                            </div>
                            <h2>3. Ảnh minh họa</h2>
                            <p>[Ảnh] Ly cà phê mùa đông, bọt sữa mịn, topping quế.</p>
                        </article>

                        <div className="approval">
                            <button className="btn" onClick={handleSubmit}>
                                Gửi duyệt
                            </button>
                            <button className="btn primary" onClick={handleSchedule}>
                                Lên lịch
                            </button>
                        </div>
                    </section>

                    {/* Side meta */}
                    <aside className="side">
                        <div className="card">
                            <h3>Thuộc tính</h3>
                            <div className="row">
                                <label className="label">Chuyên mục</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option>Công thức</option>
                                    <option>Tin tức</option>
                                    <option>Ưu đãi</option>
                                </select>
                            </div>
                            <div className="row">
                                <label className="label">Thẻ (Tags)</label>
                                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                                    {availableTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`tag ${selectedTags.includes(tag) ? "active" : ""}`}
                                            onClick={() => toggleTag(tag)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Drawer */}
            <aside
                className={`drawer ${drawerExpanded ? "expanded" : ""} ${drawerCollapsed ? "collapsed" : ""}`}
                aria-label="Bình luận nội bộ"
            >
                <header>
                    <strong>Bình luận nội bộ</strong>
                    <div style={{ display: "flex", gap: ".5rem" }}>
                        <button
                            className="btn"
                            onClick={() => setDrawerExpanded(!drawerExpanded)}
                        >
                            {drawerExpanded ? "🗗 Thu nhỏ" : "🔍 Phóng to"}
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDrawerCollapsed(!drawerCollapsed)}
                        >
                            {drawerCollapsed ? "🔼 Mở rộng" : "🔽 Thu gọn"}
                        </button>
                    </div>
                </header>
                <div className="items">
                    {comments.map((cmt) => {
                        const time = cmt.createdAt
                            ? new Date(cmt.createdAt).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "";

                        return (
                            <div key={cmt.id} className="comment">
                                <div className="meta">
                                    <strong>{cmt.author}</strong>
                                    {time && ` • ${time}`}
                                    {cmt.target && ` • ${cmt.target}`}
                                </div>
                                <div>{cmt.text}</div>
                            </div>
                        );
                    })}
                </div>
                <footer>
                    <input
                        className="input"
                        placeholder="Viết bình luận @mention …"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSendComment();
                            }
                        }}
                    />
                    <button className="btn primary" onClick={handleSendComment}>
                        Gửi
                    </button>
                </footer>
            </aside>
        </div>
    );
}