import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/register', {
          username,
          password,
      });
      alert('アカウント作成成功');
    } catch (error: any) {
      // エラーがあった場合、詳細を表示
      console.log(username);
      console.log(password);
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
        <button type="submit" className="signup-button">登録</button>
      </form>
    </div>
  );
};

export default Register;
