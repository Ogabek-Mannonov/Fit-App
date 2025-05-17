import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/auth/profile';

export default function TrainerPage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>Загрузка...</div>;
  if (error) return <div style={{ color: '#ff1744', textAlign: 'center', marginTop: 100 }}>{error}</div>;
  if (!profile) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #23243a 0%, #18192b 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#23243a', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px #18192b99', minWidth: 340 }}>
        <h2 style={{ marginBottom: 16 }}>Профиль тренера</h2>
        <div style={{ marginBottom: 12 }}><b>Имя пользователя:</b> {profile.username}</div>
        <div style={{ marginBottom: 12 }}><b>Email:</b> {profile.email}</div>
        <div style={{ marginBottom: 12 }}><b>Роль:</b> {profile.role}</div>
        {/* Можно добавить больше информации, если потребуется */}
      </div>
    </div>
  );
} 