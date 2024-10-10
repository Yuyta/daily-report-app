import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopPage.css';

const TopPage: React.FC = () => {
    const navigate = useNavigate();

  // 新規作成ボタンのクリックハンドラ
  const handleCreateNewReport = () => {
    const today = new Date().toISOString().split('T')[0]; // 今日の日付を取得
    navigate(`/new-report/${today}`); // 日報作成ページへ遷移
  };

  // カレンダーボタンのクリックハンドラ
  const handleViewCalendar = () => {
    navigate('/calendar'); // カレンダーページへ遷移
  };

  return (
    <div>
      <h1>トップページ</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleCreateNewReport} className = "new-report-button">新規日報作成</button>
      </div>
      <div>
        <button onClick={handleViewCalendar} className = "calender-button">カレンダーを見る</button>
      </div>
    </div>
  );
};

export default TopPage;
