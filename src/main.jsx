import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AuthLayout from "./Layouts/AuthLayout";
import AdminLayout from "./Layouts/AdminLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/Auth/Login/Login";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "./Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "./Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "./Pages/Admin/Dosen/Dosen";
import Matakuliah from "./Pages/Admin/Matakuliah/Matakuliah";
import Register from "./Pages/Auth/Register/Register";
import PageNotFound from "./Pages/PageNotFound";
import UserManagement from "./Pages/Admin/UserManagement/UserManagement";
import RencanaStudi from "./Pages/Admin/RencanaStudi/RencanaStudi";
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from "./utils/Contexts/AuthContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Opsional: matikan refetch otomatis saat window focus
      // staleTime: 5 * 60 * 1000, // Opsional: data dianggap fresh selama 5 menit
      // cacheTime: 10 * 60 * 1000, // Opsional: data disimpan di cache selama 10 menit
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: (<ProtectedRoute><AdminLayout /></ProtectedRoute>),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "mahasiswa", element: <Mahasiswa /> },
      { path: "mahasiswa/:id", element: <MahasiswaDetail /> },
      { path: "dosen", element: <Dosen /> },
      { path: "matakuliah", element: <Matakuliah /> },
      { path: "users", element: <UserManagement /> },        // Jika sudah ada
      { path: "rencana-studi", element: <RencanaStudi /> },  // Jika sudah ada
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider> 
        <RouterProvider router={router} />
      </AuthProvider>
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);