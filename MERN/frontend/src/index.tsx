import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import Record from './Pages/Record';
import Listen from './Pages/Listen';
import Home from './Pages/Home';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/record" element={<Record />} />
      <Route path="/listen" element={<Listen />} />
    </Routes>
  </BrowserRouter>
);


//Remove strictmode to prevent useEffect hooks from triggering twice (it loads components twice to detect problems)
//<React.StrictMode>
//</React.StrictMode>


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
