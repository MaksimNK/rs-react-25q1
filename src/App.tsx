import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { MainPage } from '@pages/MainPage';
import { HookFormPage } from '@pages/HookFormPage';
import { UncontrolledFormPage } from '@pages/UncontrolledFormPage';
import { NotFoundPage } from '@pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/hook-form" element={<HookFormPage />} />
        <Route path="/uncontrolled" element={<UncontrolledFormPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
