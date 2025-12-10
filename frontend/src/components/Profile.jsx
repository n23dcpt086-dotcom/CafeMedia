// src/components/Profile.jsx
import { useEffect, useState } from "react";
import "../styles.css";

const PROFILE_KEY = "user-profile-data";

export default function Profile({ navigate }) {
    const [fullname, setFullname] = useState("Admin");
    const [email, setEmail] = useState("admin@domain.com");
    const [avatar, setAvatar] = useState(null);
    const [toggles, setToggles] = useState([true, true]);

    useEffect(() => {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (!raw) return;
        try {
            const data = JSON.parse(raw);
            if (data.fullname) setFullname(data.fullname);
            if (data.email) setEmail(data.email);
            if (data.avatar) setAvatar(data.avatar);
            if (data.toggles) setToggles(data.toggles);
        } catch { }
    }, []);

    const saveProfile = () => {
        const data = {
            fullname,
            email,
            avatar,
            toggles,
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
        alert("Đã lưu thay đổi!");
    };

    const handleAvatarUpload = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => setAvatar(r.result);
        r.readAsDataURL(f);
    };

    const removeAvatar = () => {
        setAvatar(null);
    };

    const logout = () => {
        const ok = window.confirm("Bạn có chắc muốn đăng xuất?");
        if (!ok) return;
        navigate("/login");
    };

    return (
        <div className="profile-root">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-logo">👤</div>
                    <span><strong>Cổng nội dung số</strong></span>
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
                    <a href="/profile" className="nav-link active">👤 <span>Người dùng</span></a>
                </nav>
            </aside>

            {/* MAIN */}
            <main className="main">
                {/* TOPBAR */}
                <div className="topbar">
                    <div className="topbar-inner">
                        <div className="crumbs">Người dùng / Cài đặt tài khoản</div>
                        <button className="btn danger" onClick={logout}>Đăng xuất</button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="main-inner">

                    {/* Hồ sơ cá nhân */}
                    <section className="card">
                        <h3>Hồ sơ cá nhân</h3>

                        <div className="avatar-wrap">
                            <div className="avatar">
                                {avatar ? (
                                    <img src={avatar} alt="avatar" />
                                ) : (
                                    <span>{fullname.charAt(0).toUpperCase()}</span>
                                )}
                            </div>

                            <label className="btn">
                                Chọn avatar
                                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                            </label>

                            <button className="btn" onClick={removeAvatar}>Xóa avatar</button>
                        </div>

                        <div className="form-row">
                            <label>Họ và tên</label>
                            <input className="input" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        </div>

                        <div className="form-row">
                            <label>Email</label>
                            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <button className="btn primary full" onClick={saveProfile}>
                            Lưu thay đổi
                        </button>
                    </section>

                    {/* Cài đặt */}
                    <section className="card">
                        <h3>Cài đặt tài khoản</h3>

                        <div className="switch-row">
                            <div>Email thông báo</div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={toggles[0]}
                                    onChange={() => setToggles(([a, b]) => [!a, b])}
                                />
                                <div className="toggle-track"><div className="toggle-thumb"></div></div>
                            </label>
                        </div>

                        <div className="switch-row">
                            <div>Hiển thị avatar</div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={toggles[1]}
                                    onChange={() => setToggles(([a, b]) => [a, !b])}
                                />
                                <div className="toggle-track"><div className="toggle-thumb"></div></div>
                            </label>
                        </div>
                    </section>

                    {/* Đổi mật khẩu */}
                    <section className="card">
                        <h3>Đổi mật khẩu</h3>

                        <div className="form-row">
                            <label>Mật khẩu hiện tại</label>
                            <input type="password" className="input" />
                        </div>

                        <div className="form-row">
                            <label>Mật khẩu mới</label>
                            <input type="password" className="input" />
                        </div>

                        <div className="form-row">
                            <label>Nhập lại mật khẩu mới</label>
                            <input type="password" className="input" />
                        </div>

                        <button className="btn full">Đổi mật khẩu</button>
                    </section>

                    {/* Phiên đăng nhập */}
                    <section className="card">
                        <h3>Phiên đăng nhập</h3>

                        <div className="session-item">
                            <div>
                                <strong>Chrome – Máy hiện tại</strong>
                                <div className="session-meta">Đang hoạt động</div>
                            </div>
                        </div>

                        <div className="session-item">
                            <div>
                                <strong>iPhone – Safari</strong>
                                <div className="session-meta">Lần cuối: hôm qua</div>
                            </div>
                            <button className="btn">Đăng xuất</button>
                        </div>

                        <button className="btn danger full" style={{ marginTop: ".75rem" }}>
                            Đăng xuất khỏi tất cả thiết bị
                        </button>
                    </section>

                </div>
            </main>
        </div>
    );
}