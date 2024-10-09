import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import TopPage from './components/TopPage';
import Login from './components/Login';
import NewReport from './components/NewReport';
import SignUp from './components/Register'; // アカウント作成画面のインポート
import CalendarPage from './components/CalendarPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/new-report/:date" element={<NewReport/>} />
        <Route path="/calendar" element={<CalendarPage/>} />
        
        {/* 初回アクセス時にアカウント作成画面にリダイレクト */}
        <Route path="/" element={<Navigate to="/signup" replace />} />

      </Routes>
    </Router>
  );
};

export default App;