import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; // Reactのカレンダーコンポーネント
import 'react-calendar/dist/Calendar.css';

const CalendarPage: React.FC = () => {
  const [reports, setReports] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reports');
        setReports(response.data);
      } catch (error) {
        console.error('日報の取得に失敗しました:', error);
      }
    };

    fetchReports();
  }, []);

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (reports[formattedDate]) {
      navigate(`/report/${formattedDate}`);
    } else {
      console.log('この日付の日報はありません');
    }
  };

  return (
    <div>
      <h1>カレンダーページ</h1>
      <Calendar
        onClickDay={handleDateClick}
      />
      <button onClick={() => navigate('/')}>戻る</button>
    </div>
  );
};

export default CalendarPage;
