import { useEffect, useState } from "react";

export default function UserProfile({ navigate }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setName(data.name);
          setDateOfBirth(data.dateOfBirth || "");
          setPhone(data.phone || "");
          setAvatar(data.avatar || "");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const isChanged =
    user &&
    (
      name !== user.name ||
      dateOfBirth !== (user.dateOfBirth || "") ||
      phone !== (user.phone || "") ||
      avatar !== (user.avatar || "") ||
      oldPw.length > 0 ||
      newPw.length > 0
    );

  async function updateUser() {
    if (!isChanged) return;

    const res = await fetch("http://localhost:5000/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        dateOfBirth,
        phone,
        avatar,
        oldPassword: oldPw || undefined,
        newPassword: newPw || undefined,
      }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      window.location.reload();
    }
  }

  const logout = () => {
    const ok = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (!ok) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (loading) return <div className="article-loading">Đang tải thông tin…</div>;
  if (!user) {
    return (
      <div className="article-notfound">
        Không thể tải thông tin tài khoản.
        <br />
        <button onClick={() => navigate("/home")}>Quay về Home</button>
      </div>
    );
  }

  return (
    <div className="article-detail-root">
      <div className="article-topbar">
        <button className="article-btn-back" onClick={() => navigate("/home")}>
          ⬅ Quay về Home
        </button>
      </div>

      <div className="article-container">
        <h2 className="article-title">Thông tin tài khoản</h2>

        <div style={{ marginBottom: "1rem" }}>
          <div className="article-author">
            <div className="article-avatar">
              <img
                src={avatar || user.avatar}
                alt="avatar"
                style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div className="article-author-name">{user.name}</div>
              <div className="article-date">{user.email}</div>
            </div>
          </div>
        </div>

        <p><strong>Họ và tên:</strong> {user.name}</p>
        <p><strong>Ngày sinh:</strong> {user.dateOfBirth ?? "Chưa có"}</p>
        <p><strong>Số điện thoại:</strong> {user.phone ?? "Chưa có"}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <h3 style={{ marginTop: "2rem" }}>Cập nhật thông tin</h3>

        <div className="form-group">
          <label>Họ và tên</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Ngày sinh</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Avatar URL</label>
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </div>

        <h3 style={{ marginTop: "2rem" }}>Đổi mật khẩu</h3>

        <div className="form-group">
          <label>Mật khẩu cũ</label>
          <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
        </div>

        <button
          className="article-btn-back"
          onClick={updateUser}
          disabled={!isChanged}
          style={{
            opacity: isChanged ? 1 : 0.5,
            cursor: isChanged ? "pointer" : "not-allowed",
            marginTop: "12px",
          }}
        >
          Lưu thay đổi
        </button>

        <button
          className="article-btn-back"
          style={{ marginTop: "1.2rem", background: "#fee2e2", borderColor: "#fca5a5", color: "#b91c1c" }}
          onClick={logout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}