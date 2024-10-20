import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
//各コンポーネント(私が作成したページ)をインポート
import TopPage from './components/TopPage';
import Login from './components/Login';
import NewReport from './components/NewReport';
import SignUp from './components/Register'; // アカウント作成画面のインポート
import CalendarPage from './components/CalendarPage';

//ここでルートを定義　React.FC(Function Component)はTypeScriptの型定義
//Routerで全体を囲み、その中にRoutesを配置する構造になっている
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/top" element={<TopPage/>} />
        {/* 初回アクセス時にアカウント作成画面にリダイレクト */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        {/* :dateはパラメータを示し、urlでdateの値をコンポーネントとして使用できる */}
        <Route path="/new-report/:date" element={<NewReport/>} />
        <Route path="/calendar" element={<CalendarPage/>} />
        


      </Routes>
    </Router>
  );
};

export default App;