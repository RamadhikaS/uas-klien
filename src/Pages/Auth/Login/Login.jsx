import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, Navigate, useLocation } from 'react-router-dom'; 
import Input from "../../../Components/Input";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import Link from "../../../Components/Link";
import Card from "../../../Components/Card";
import Heading from "../../../Components/Heading";
import Form from "../../../Components/Form";

import { loginApi } from "../../../utils/Apis/AuthApi";
import { showSuccessToast, showErrorToast } from "../../../utils/toastHelper";

import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, isAuthenticated, isLoadingAuth } = useAuthStateContext(); 

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      console.log("Login.jsx: User sudah login, redirecting ke", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate, location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      showErrorToast("Email dan password harus diisi.");
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await loginApi(email, password);
      setUser(loggedInUser);
      showSuccessToast("Login berhasil! Mengarahkan...");

      const from = location.state?.from?.pathname || "/admin/dashboard";
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);

    } catch (error) {
      console.error("Login failed:", error);
      showErrorToast(error.message || "Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memeriksa sesi...</p>
      </div>
    );
  }

  return (
    <Card className="max-w-md w-full">
      <Heading as="h2">Login</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            required
            disabled={isLoading } 
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>
          <Link href="#">Lupa password?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Login'}
        </Button>
      </Form>
       <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun?{' '}
        <RouterLink to="/register" className="font-medium text-blue-600 hover:text-blue-500">
          Daftar di sini
        </RouterLink>
      </p>
    </Card>
  );
};

export default Login;