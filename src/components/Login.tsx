import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      setMessage('ログイン成功');
      // トークンをローカルストレージに保存
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setMessage('ログインに失敗しました');
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ユーザ名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">ログイン</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;