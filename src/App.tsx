import { Navigate, Route, Routes } from 'react-router-dom';
import { GetStartedPage } from './pages/GetStartedPage';
import { LogInPage } from './pages/LogInPage';
import { WelcomePage } from './pages/WelcomePage';

export default function App() {
  return (
    <div className="device-frame">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/log-in" element={<LogInPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
