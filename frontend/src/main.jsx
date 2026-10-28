import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext.jsx';
import { ReadingListProvider } from './context/ReadingListContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ReadingListProvider>
        <ThemeProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </ReadingListProvider>
    </AuthProvider>
  </BrowserRouter>
);