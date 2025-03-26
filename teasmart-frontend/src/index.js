import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' for React 18
import App from './App';
import { ThemeProvider } from '@mui/material/styles'; // If using Material-UI
import theme from './theme'; // If using Material-UI

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* If using Material-UI */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
