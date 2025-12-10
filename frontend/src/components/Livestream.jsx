import { useEffect, useRef, useState } from "react";
import "../styles.css";

export default function Livestream({ navigate }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [stream]);

    const startPreview = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
            }
        } catch (e) {
            alert("Không truy cập được camera hoặc microphone.");
        }
    };

    return (
        <div className="app livestream">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-logo">🎥</div>
                    <span><strong>Livestream</strong></span>
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
                    <a
                        className={`nav-link ${window.location.pathname === "/livestream" ? "active" : ""}`}
                        href="/livestream"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/livestream");
                        }}
                    >
                        🎥 <span>Livestream</span>
                    </a>
                    <a href="/campaign" className="nav-link">📢 <span>Chiến dịch</span></a>
                    <a href="/seo" className="nav-link">⚙️ <span>SEO & Hiệu năng</span></a>
                    <a href="/profile" className="nav-link">👤 <span>Người dùng</span></a>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main">
                <div className="topbar">
                    <div className="topbar-inner">
                        <div className="crumbs">Livestream</div>
                    </div>
                </div>

                <section className="content">
                    {/* LEFT PANEL */}
                    <div className="panel">
                        <header>
                            <h3>Phòng phát trực tiếp</h3>
                            <div style={{ display: "flex", gap: ".5rem" }}>
                                <button className="btn" onClick={startPreview}>Kiểm tra kết nối</button>
                                <button className="btn">Ghi hình</button>
                                <button className="btn primary">Go Live</button>
                                <button className="btn danger">Kết thúc</button>
                            </div>
                        </header>

                        {/* PREVIEW AREA */}
                        <div className="preview">
                            <video ref={videoRef} autoPlay playsInline muted></video>

                            <div className="grid"></div>
                            <div className="status">PREVIEW</div>
                            <div className="meta">
                                Nguồn: Camera HD Pro • Mic: USB Mic • 1080p30 (demo)
                            </div>

                            {/* Overlay icon */}
                            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                                <div style={{ fontSize: "48px", opacity: ".2" }}>🎬</div>
                                <div style={{ opacity: ".6" }}>Xem trước nguồn video/âm thanh</div>
                            </div>
                        </div>

                        <div className="controls">
                            <button className="btn">🎙️ Mute mic</button>
                            <button className="btn">🎧 Monitor</button>
                            <button className="btn">🖥️ Share screen</button>
                            <button className="btn">🗔 Layout</button>
                            <button className="btn">↻ Refresh devices</button>
                        </div>

                        <div className="grid-2">
                            <div className="field">
                                <label className="label">Nguồn hình & tiếng</label>
                                <select className="input">
                                    <option>Camera: HD Pro C920</option>
                                    <option>Camera: Integrated</option>
                                </select>
                                <select className="input">
                                    <option>Mic: USB Condenser</option>
                                    <option>Mic: System default</option>
                                </select>
                            </div>

                            <div className="field">
                                <label className="label">Tiêu đề & mô tả</label>
                                <input className="input" placeholder="Livestream: Pha cà phê mùa đông" />
                                <textarea className="input" rows="2" placeholder="Giới thiệu công thức cold brew & latte art..."></textarea>
                            </div>

                            <div className="field" style={{ gridColumn: "1 / -1" }}>
                                <label className="label">Đa kênh (Multistream Targets)</label>
                                <div className="targets">
                                    <div className="target">
                                        <div className="dot" style={{ background: "#1877F2" }}></div>
                                        <div>
                                            <strong>Facebook Page</strong>
                                            <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>
                                                Kết nối thông qua RTMP
                                            </div>
                                        </div>
                                        <button className="btn">Kết nối</button>
                                    </div>

                                    <div className="target">
                                        <div className="dot" style={{ background: "#FF0000" }}></div>
                                        <div>
                                            <strong>YouTube</strong>
                                            <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>
                                                Stream key: **********
                                            </div>
                                        </div>
                                        <button
                                            className="btn"
                                            style={{ background: "#E6F4F1", borderColor: "#CFEAE2" }}
                                        >
                                            Đang bật
                                        </button>
                                    </div>

                                    <div className="target">
                                        <div className="dot" style={{ background: "#000" }}></div>
                                        <div>
                                            <strong>TikTok</strong>
                                            <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>
                                                Yêu cầu tài khoản live
                                            </div>
                                        </div>
                                        <button className="btn">Kết nối</button>
                                    </div>

                                    <div className="target">
                                        <div className="dot" style={{ background: "var(--teal-600)" }}></div>
                                        <div>
                                            <strong>RTMP Tuỳ chỉnh</strong>
                                            <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>
                                                rtmp://live.example.com/app
                                            </div>
                                        </div>
                                        <button className="btn">Chỉnh</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="stack">
                        {/* CHAT */}
                        <div className="card chat">
                            <header>
                                <h3>Chat & Q&A (Realtime)</h3>
                                <button className="btn">Bật chậm</button>
                            </header>

                            <div className="list">
                                <div className="msg">
                                    <div className="meta"><strong>@An</strong> • YouTube • 09:01</div>
                                    <div>Hạt dùng là Arabica hay Robusta ạ?</div>
                                </div>
                                <div className="msg">
                                    <div className="meta"><strong>@Chi</strong> • Facebook • 09:02</div>
                                    <div>Âm thanh rõ lắm!</div>
                                </div>
                                <div className="msg">
                                    <div className="meta"><strong>@Linh</strong> • TikTok • 09:05</div>
                                    <div>Anh chia sẻ tỉ lệ latte được không?</div>
                                </div>
                            </div>

                            <footer>
                                <input className="input" placeholder="Nhập tin nhắn / trả lời @mention" />
                                <button className="btn primary">Gửi</button>
                            </footer>
                        </div>

                        {/* GUESTS */}
                        <div className="card">
                            <header>
                                <h3>Khách mời</h3>
                                <button className="btn">Mời</button>
                            </header>

                            <div className="guests">
                                <div className="guest">
                                    <div className="avatar">MC</div>
                                    <div>
                                        <strong>Mai Chi</strong>
                                        <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>Role: Co-host • Screen</div>
                                    </div>
                                    <button className="btn">Remove</button>
                                </div>

                                <div className="guest">
                                    <div className="avatar">KA</div>
                                    <div>
                                        <strong>Khánh An</strong>
                                        <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>Role: Co-host • Screen</div>
                                    </div>
                                    <button className="btn">Remove</button>
                                </div>
                            </div>
                        </div>

                        {/* LIVE STATS */}
                        <div className="card">
                            <header>
                                <h3>Chỉ số trực tiếp</h3>
                                <button className="btn ghost">Làm mới</button>
                            </header>

                            <div className="stats">
                                <div className="kpi">
                                    <div className="title">Đang xem</div>
                                    <div className="value">482</div>
                                </div>
                                <div className="kpi">
                                    <div className="title">Tương tác/phút</div>
                                    <div className="value">76</div>
                                </div>
                                <div className="kpi">
                                    <div className="title">Độ trễ ước tính</div>
                                    <div className="value">2.1s</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}