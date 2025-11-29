import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Importación de vistas y componentes
import LoginPage from '../views/LoginPage';
import Navbar from '../components/shared/Navbar';
import CaregiverDashboard from '../views/caregiver/CaregiverDashboard';
import ChildDetails from '../views/caregiver/ChildDetails';
import AllChildren from '../views/caregiver/AllChildren';
import Index from '../views/caregiver/Index';

import SmartwatchManagerPage from '../views/admin/SmartwatchManagerPage';
import TutorIndex from '../views/tutor/Index';
import ChildDetailsTutor from '../views/tutor/ChildDetails';
import TutorDashboard from '../views/tutor/TutorDashboard';

import RegistrationPage from '../views/admin/RegistrationPage';


const AppRouter = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'index': return '/cuidador/index';
      case 'tutor': return '/tutor/index';

      case 'caregiver': return '/cuidador/index';
      // case 'caregiver': return '/cuidador/dashboard';


      default: return '/login';
    }
  };

  console.log("ROLE ACTUAL:", user?.role);


  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to={getDashboardPath()} /> : <LoginPage />} />

        {user && (
          <>
            <Route path="/cuidador/index" element={<Index />} />
            <Route path="/cuidador/dashboard" element={<CaregiverDashboard />} />
            <Route path="/cuidador/todos" element={<AllChildren />} />


            <Route path="/niño/:id" element={<ChildDetails />} />
            
            <Route path="/admin/smartwatches" element={<SmartwatchManagerPage />} />
            <Route path="/admin/registration" element={<RegistrationPage />} />

            <Route path="/tutor/index" element={<TutorIndex />} />
            <Route path="/tutor/niño/:id" element={<ChildDetailsTutor />} /> 
            <Route path="/tutor/dashboard" element={<TutorDashboard />} /> 


          </>
        )}

        <Route path="*" element={<Navigate to={getDashboardPath()} />} />
      </Routes>
    </>
  );
};

export default AppRouter;