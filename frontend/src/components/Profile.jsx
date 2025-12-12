// src/components/Profile.jsx
import { useEffect, useState } from "react";
import "../styles.css";

const API_BASE = "http://localhost:5000";
const TOKEN_KEY = "token";

export default function Profile({ navigate }) {
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const token = localStorage.getItem(TOKEN_KEY);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    const loadMe = async () => {
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth");
        return;
      }

      const data = await res.json();

      setCreatedAt(data.createdAt ?? "");
      setUpdatedAt(data.updatedAt ?? "");

      setFullname(data.name ?? "");
      setEmail(data.email ?? "");
      setDateOfBirth(data.dateOfBirth ?? "");
      setPhone(data.phone ?? "");
      setAvatar(data.avatar ?? null);
    };

    loadMe();
  }, []);

  const handleAvatarUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const r = new FileReader();
    r.onload = () => setAvatar(r.result);
    r.readAsDataURL(f);
  };

  const removeAvatar = () => setAvatar(null);

  const saveProfile = async () => {
    const payload = {
      name: fullname,
      dateOfBirth: dateOfBirth || null,
      phone: phone || null,
      avatar,
    };

    const res = await fetch(`${API_BASE}/api/users/me`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message ?? "Cập nhật thất bại");
      return;
    }

    alert("Đã lưu thay đổi!");
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !newPassword2) {
      alert("Vui lòng nhập đủ mật khẩu.");
      return;
    }
    if (newPassword !== newPassword2) {
      alert("Mật khẩu mới nhập lại không khớp.");
      return;
    }

    const res = await fetch(`${API_BASE}/api/users/me`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message ?? "Đổi mật khẩu thất bại");
      return;
    }

    setOldPassword("");
    setNewPassword("");
    setNewPassword2("");
    alert("Đổi mật khẩu thành công!");
  };

  const logout = () => {
    const ok = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (!ok) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="profile-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">👤</div>
          <span>
            <strong>Cổng nội dung số</strong>
          </span>
        </div>

        <nav className="nav">
          <a href="/dashboard" className="nav-link">
            📊 <span>Dashboard</span>
          </a>

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

          <a href="/schedule" className="nav-link">
            📅 <span>Lịch xuất bản</span>
          </a>
          <a href="/livestream" className="nav-link">
            🎥 <span>Livestream</span>
          </a>
          <a href="/campaign" className="nav-link">
            📢 <span>Chiến dịch</span>
          </a>
          <a href="/seo" className="nav-link">
            ⚙️ <span>SEO & Hiệu năng</span>
          </a>
          <a href="/profile" className="nav-link active">
            👤 <span>Người dùng</span>
          </a>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-inner">
            <div className="crumbs">Người dùng / Cài đặt tài khoản</div>
            <button className="btn danger" onClick={logout}>
              Đăng xuất
            </button>
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
                  <span>{(fullname?.charAt(0) || "A").toUpperCase()}</span>
                )}
              </div>

              <label className="btn">
                Chọn avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>

              <button className="btn" onClick={removeAvatar}>
                Xóa avatar
              </button>
            </div>

            <div className="form-row">
              <label>Họ và tên</label>
              <input
                className="input"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Email</label>

              <input
                className="input input-disabled"
                value={email}
                readOnly
                disabled
                title="Email không thể thay đổi"
              />
            </div>

            <div className="form-row">
              <label>Ngày sinh</label>
              <input
                type="date"
                className="input"
                value={dateOfBirth || ""}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Số điện thoại</label>
              <input
                className="input"
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Ngày tạo</label>
              <input className="input" value={createdAt ?? ""} readOnly disabled />
            </div>

            <div className="form-row">
              <label>Cập nhật lần cuối</label>
              <input className="input" value={updatedAt ?? ""} readOnly disabled />
            </div>

            <button className="btn primary full" onClick={saveProfile}>
              Lưu thay đổi
            </button>
          </section>

          {/* Đổi mật khẩu */}
          <section className="card">
            <h3>Đổi mật khẩu</h3>

            <div className="form-row">
              <label>Mật khẩu hiện tại</label>
              <input
                type="password"
                className="input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Nhập lại mật khẩu mới</label>
              <input
                type="password"
                className="input"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
              />
            </div>

            <button className="btn full" onClick={changePassword}>
              Đổi mật khẩu
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}