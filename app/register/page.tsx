'use client';
import { useState } from "react";
import styles from "./RegisterForm.module.css";
import { signUp } from "../../lib/supabaseAuth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      await signUp(email, password);
      setMessage("Đăng ký thành công!");
      setEmail("");
    setPassword("");
    } catch (error) {
      setMessage(error.message || "Đăng ký thất bại.");
    }
  }

  return (
    <div className={styles.formContainer}>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.title}>Đăng ký tài khoản</div>
        <input
            className={styles.input}
            type="email"
            placeholder="Email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <input
            className={styles.input}
            type="password"
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <button type="submit" className={styles.button}>Đăng ký</button>
        <div className={styles.message}>{message}</div>
      </form>
    </div>
  );
}
