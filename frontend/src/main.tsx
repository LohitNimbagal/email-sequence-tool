// import './index.css'

// import { createRoot } from "react-dom/client";
// import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

// // import Home from './pages/home';
// import Login from './pages/auth/login';
// import NotFound from './pages/not-found';
// import Register from './pages/auth/register';

// import Dashboard from './pages/dashboard/dashboard';
// import Layout from './components/layout';
// import Sequence from './pages/outreach/sequence';
// import Outbox from './pages/outreach/outbox';
// import Lists from './pages/outreach/lists';
// import Templates from './pages/outreach/templates';
// import OutreachLayout from './pages/outreach/layout';

// import { AuthProvider } from './contexts/auth-context';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       { index: true, element: <Dashboard /> },
//       {
//         path: 'outreach',
//         element: <OutreachLayout />,
//         children: [
//           { index: true, element: <Navigate to="sequence" replace /> },
//           { path: 'lists', element: <Lists /> },
//           { path: 'outbox', element: <Outbox /> },
//           { path: 'sequence', element: <Sequence /> },
//           { path: 'templates', element: <Templates /> },
//         ]
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/register",
//     element: <Register />,
//   },
//   {
//     path: "*",
//     element: <NotFound />,
//   }
// ]);

// const root = document.getElementById("root");

// createRoot(root!).render(
//   <AuthProvider>
//     <RouterProvider router={router} />
//   </AuthProvider>
// );

import './index.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}