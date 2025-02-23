import { FC } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DetailItemPage } from './pages/DetailItemPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from './context/ThemeProvider';
import ThemeSelector from './components/ThemeSelector';

export const App: FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <header className="app-header">
          <ThemeSelector />
        </header>
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route path="/details/:id" element={<DetailItemPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
