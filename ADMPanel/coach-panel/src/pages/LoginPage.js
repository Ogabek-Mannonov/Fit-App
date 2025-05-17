import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/auth/login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(API_URL, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.role === 'trainer') {
        navigate('/trainer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #23243a 0%, #18192b 100%)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#23243a', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px #18192b99', minWidth: 320 }}>
        <h2 style={{ color: '#fff', marginBottom: 24 }}>Вход</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #7f5fff' }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #7f5fff' }}
        />
        {error && <div style={{ color: '#ff1744', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 12, background: 'linear-gradient(90deg, #7f5fff 0%, #32e6e2 100%)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16 }}>Войти</button>
      </form>
    </div>
  );
} 