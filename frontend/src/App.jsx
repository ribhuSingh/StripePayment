import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaymentCompletion from './pages/PaymentCompletion';
import PaymentRejection from './pages/PaymentRejection';
import PaymentPage from './pages/PaymentPage'; 
import './App.css'
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<PaymentPage />} />
        <Route path="/completion" element={<PaymentCompletion />} />
        <Route path='/rejection' element={<PaymentRejection/>}/>
     
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
                <Route path='/dashboard' element={<DashboardAdmin/>}/>
      </Routes>
    
  );
}

export default App;
