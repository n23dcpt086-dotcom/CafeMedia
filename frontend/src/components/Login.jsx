// src/components/Auth.jsx
import { useState } from "react";
import "../styles.css";
import { mockLogin, mockSignup } from "../api/authMock";

export default function Auth({ navigate }) {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [remember, setRemember] = useState(false);

  const [name, setName] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPw1, setSignPw1] = useState("");
  const [signPw2, setSignPw2] = useState("");

  const [showPwLogin, setShowPwLogin] = useState(false);
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setOkMsg("");

    if (!loginEmail.trim() || loginPw.trim().length < 6) {
      setErrorMsg("Email hoặc mật khẩu không hợp lệ.");
      return;
    }

    try {
      const user = mockLogin(loginEmail.trim(), loginPw.trim());
      setErrorMsg("");
      setOkMsg(`Đăng nhập thành công. Xin chào ${user.name}!`);

      const target = "/";

      if (typeof navigate === "function") {
        navigate(target);
      } else {
        window.location.href = target;
      }
    } catch (err) {
      setErrorMsg(err.message || "Không đăng nhập được.");
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setOkMsg("");

    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập họ tên.");
      return;
    }

    if (!signEmail.trim()) {
      setErrorMsg("Vui lòng nhập email.");
      return;
    }

    if (signPw1.trim().length < 6 || signPw1 !== signPw2) {
      setErrorMsg("Vui lòng kiểm tra mật khẩu (>= 6 ký tự và trùng nhau).");
      return;
    }

    try {
      mockSignup({
        name: name.trim(),
        email: signEmail.trim(),
        password: signPw1.trim(),
      });

      setErrorMsg("");
      setOkMsg("Tạo tài khoản thành công. Hãy đăng nhập!");

      setSignPw1("");
      setSignPw2("");
      setTab("login");
    } catch (err) {
      setErrorMsg(err.message || "Không tạo được tài khoản.");
    }
  };

  const openReset = (e) => {
    e.preventDefault();
    setResetOpen(true);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    alert(
      "Đã gửi liên kết khôi phục tới " +
      (resetEmail.trim() || "email của bạn")
    );
    setResetOpen(false);
  };

  const renderAlerts = () => (
    <>
      {errorMsg && (
        <div className="error" id="errorBox">
          {errorMsg}
        </div>
      )}
      {okMsg && (
        <div className="ok" id="okBox">
          {okMsg}
        </div>
      )}
    </>
  );

  return (
    <div className="auth-root">
      <div className="shell">
        {/* Left side */}
        <div className="left">
          <div className="hero" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1>Café Media Portal</h1>
            <p>
              Đăng nhập để quản trị nội dung, lịch xuất bản, livestream và
              chiến dịch đa kênh.
            </p>
            <div className="kpis">
              <div className="kpi">
                <div className="n">21</div>
                <div>Chiến dịch đang chạy</div>
              </div>
              <div className="kpi">
                <div className="n">134</div>
                <div>Bài chờ duyệt</div>
              </div>
              <div className="kpi">
                <div className="n">92%</div>
                <div>Đúng hạn tháng này</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="right">
          <div className="brand">
            <div className="logo">☕</div>
            <div>
              <strong>Café Portal</strong>
              <div className="note">Phiên bản demo</div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="tabs"
            role="tablist"
            aria-label="Chuyển biểu mẫu"
          >
            <button
              type="button"
              className={`tab ${tab === "login" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "login"}
              onClick={() => {
                setTab("login");
                setErrorMsg("");
                setOkMsg("");
              }}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={`tab ${tab === "signup" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "signup"}
              onClick={() => {
                setTab("signup");
                setErrorMsg("");
                setOkMsg("");
              }}
            >
              Đăng ký
            </button>
          </div>

          {/* Alerts */}
          {renderAlerts()}

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form id="loginForm" noValidate onSubmit={handleLoginSubmit}>
              <div className="row">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="ban@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="row field">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  className="input"
                  type={showPwLogin ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  aria-label="Hiện/ẩn mật khẩu"
                  onClick={() => setShowPwLogin((v) => !v)}
                >
                  {showPwLogin ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="actions">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".4rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />{" "}
                  Ghi nhớ
                </label>
                <button
                  type="button"
                  id="forgotLink"
                  onClick={openReset}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#0E7490" }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <button className="btn primary" type="submit">
                Đăng nhập
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {tab === "signup" && (
            <form id="signupForm" noValidate onSubmit={handleSignupSubmit}>
              <div className="row">
                <label htmlFor="name">Họ tên</label>
                <input
                  id="name"
                  className="input"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <label htmlFor="semail">Email</label>
                <input
                  id="semail"
                  className="input"
                  type="email"
                  placeholder="ban@company.com"
                  value={signEmail}
                  onChange={(e) => setSignEmail(e.target.value)}
                  required
                />
              </div>
              <div className="row field">
                <label htmlFor="spassword">Mật khẩu</label>
                <input
                  id="spassword"
                  className="input"
                  type={showPw1 ? "text" : "password"}
                  placeholder="Tối thiểu 6 ký tự"
                  value={signPw1}
                  onChange={(e) => setSignPw1(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPw1((v) => !v)}
                >
                  {showPw1 ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="row field">
                <label htmlFor="spassword2">Nhập lại mật khẩu</label>
                <input
                  id="spassword2"
                  className="input"
                  type={showPw2 ? "text" : "password"}
                  placeholder="Nhập lại"
                  value={signPw2}
                  onChange={(e) => setSignPw2(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPw2((v) => !v)}
                >
                  {showPw2 ? "🙈" : "👁️"}
                </button>
              </div>
              <button className="btn primary" type="submit">
                Tạo tài khoản
              </button>
            </form>
          )}

          <div
            style={{
              margin: "1rem 0",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            — hoặc tiếp tục với —
          </div>

          <div className="social">
            <button
              className="sbtn"
              onClick={() => alert("Redirect tới Google OAuth...")}
            >
              🔴 Google
            </button>
            <button
              className="sbtn"
              onClick={() => alert("Redirect tới Facebook OAuth...")}
            >
              🔵 Facebook
            </button>
            <button
              className="sbtn"
              onClick={() => alert("Redirect tới Zalo OAuth...")}
            >
              🔷 Zalo
            </button>
          </div>

          <div className="footer">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <a href="/terms">Điều khoản</a> và <a href="/privacy">Chính sách</a>.
          </div>
        </div>
      </div>

      {/* Reset modal (React-controlled) */}
      {resetOpen && (
        <dialog
          open
          style={{
            border: "none",
            borderRadius: "16px",
            maxWidth: "420px",
            width: "90vw",
            padding: 0,
            boxShadow: "0 6px 24px rgba(15,23,42,.12)",
          }}
        >
          <form
            method="dialog"
            style={{ padding: "1rem" }}
            onSubmit={handleResetSubmit}
          >
            <h3 style={{ margin: ".2rem 0 1rem 0" }}>Khôi phục mật khẩu</h3>
            <div className="row">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="ban@company.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                justifyContent: "flex-end",
                marginTop: ".5rem",
              }}
            >
              <button
                className="btn"
                type="button"
                onClick={() => setResetOpen(false)}
              >
                Huỷ
              </button>
              <button className="btn primary" type="submit">
                Gửi liên kết
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}