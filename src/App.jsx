import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <main className="pb-4">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;