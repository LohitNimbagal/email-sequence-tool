import './index.css'

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Home from './pages/home';
import Login from './pages/auth/login';
import NotFound from './pages/not-found';
import Register from './pages/auth/register';
import Dashboard from './pages/dashboard/dashboard';

import { AuthProvider } from './contexts/auth-context';
import ProtectedRoute from './components/protected-route';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // ← This guide page
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

const root = document.getElementById("root");

createRoot(root!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
