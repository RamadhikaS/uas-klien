import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Card from '../../../Components/Card';
import Heading from '../../../Components/Heading';
import Form from '../../../Components/Form';
import Label from '../../../Components/Label';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import Link from '../../../Components/Link';

import { registerApi } from '../../../utils/Apis/AuthApi';
import { showSuccessToast, showErrorToast } from '../../../utils/toastHelper';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = "Nama tidak boleh kosong."; isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email tidak boleh kosong."; isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Format email tidak valid."; isValid = false;
    }
    if (!formData.password) {
      errors.password = "Password tidak boleh kosong."; isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter."; isValid = false;
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak boleh kosong."; isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password dan konfirmasi password tidak cocok."; isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { name, email, password } = formData;
      const registeredUser = await registerApi({ name, email, password });

      showSuccessToast(`Registrasi berhasil untuk ${registeredUser.name}! Silakan login.`);
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Registration failed:", error);
      showErrorToast(error.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <Heading as="h2" className="text-center">Registrasi Akun Baru</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap Anda"
            className={formErrors.name ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Masukkan alamat email"
            className={formErrors.email ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimal 6 karakter"
            className={formErrors.password ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi password Anda"
            className={formErrors.confirmPassword ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Daftar'}
        </Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-6">
        Sudah punya akun?{' '}
        <RouterLink to="/" className="font-medium text-blue-600 hover:text-blue-500">
          Login di sini
        </RouterLink>
      </p>
    </Card>
  );
};

export default Register;