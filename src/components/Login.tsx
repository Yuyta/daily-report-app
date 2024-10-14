import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      setMessage('ログイン成功');
      navigate('/top');
      // トークンをローカルストレージに保存
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setMessage('ログインに失敗しました');
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text" className="login-username"
          placeholder="ユーザ名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password" className="login-password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">ログイン</button>
      </form>
      {message && <p>{message}</p>}
      <div className="to-signup-page">
        <a href='/signup'>アカウント作成がまだの方はこちら</a>
      </div>
    </div>
  );
};

export default Login;