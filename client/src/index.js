import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/appContext';
import {BrowserRouter as Router , Routes , Route} from "react-router-dom"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <AppProvider>

      <Router basename='music'>

        <Routes>

          <Route path='/*' element={<App/>}/>

        </Routes>

      </Router>

    </AppProvider>

  </React.StrictMode>
);
