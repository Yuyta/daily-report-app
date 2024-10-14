import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/register', {
          username,
          password,
      });
      alert('アカウント作成成功');
      navigate('/login'); // アカウント作成成功後にログインページへ遷移
    } catch (error: any) {
      // エラーがあった場合、詳細を表示
      //console.log(username);
      //console.log(password);
      if (error.response) {
        alert(`アカウント作成に失敗しました: ${error.response.data.error}`);
      } else {
        alert('アカウント作成に失敗しました。');
      }
    }
  };

  return (
    <div>
      <h2>アカウント作成</h2>
      <form onSubmit={handleSubmit} className="signup-form">
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
        <button type="submit" className="signup-button">登録</button>
      </form>
      <div className="to-login-page">
        <a href='/'>アカウント作成がお済の方はこちら</a>
      </div>
    </div>
  );
};

export default Register;
