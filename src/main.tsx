import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import SmoothScrollProvider from './components/providers/SmoothScrollProvider';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx';
import './styles/deck.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SmoothScrollProvider>
          <App />
        </SmoothScrollProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
