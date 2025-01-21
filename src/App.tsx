import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReservationForm from './components/ReservationForm';
import CompanyInput2 from './components/CompanyInput2';
import CompanyList from './components/CompanyList';
import GuestSignIn from './components/GuestSignIn';
import Agreement from './components/Agreement';
import CodeError from './components/CodeError';
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<ReservationForm />} />
            <Route path="/company-input2" element={<CompanyInput2 />} />
            <Route path="/list" element={<CompanyList />} />
            <Route path="/guest-signin" element={<GuestSignIn />} />
            <Route path="/agreement" element={<Agreement />} />
            <Route path="/code-error" element={<CodeError />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;