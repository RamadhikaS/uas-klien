import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStateContext } from '../utils/Contexts/AuthContext';

const Sidebar = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuthStateContext();

  const linkClasses = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white";
  const activeLinkClasses = "bg-blue-700 text-white";

  if (isLoadingAuth) {
    return (
        <aside className="w-64 bg-blue-800 text-blue-100 min-h-screen p-4">
            <p className="text-sm text-blue-300">Memuat menu...</p>
        </aside>
    );
  }

  if (!isAuthenticated || !user) {
    return null; 
  }

  const permissions = user.permission || [];

  return (
    <aside className="w-64 bg-blue-800 text-blue-100 min-h-screen p-4 space-y-2"> 
      <div className="mb-4 p-2 border-b border-blue-700">
        <h2 className="text-lg font-semibold text-white">Menu Navigasi</h2>
      </div>
      <nav className="space-y-1">
        {permissions.includes("dashboard.page") && (
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Dashboard
          </NavLink>
        )}

        {permissions.includes("mahasiswa.page") && (
          <NavLink 
            to="/admin/mahasiswa" 
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Mahasiswa
          </NavLink>
        )}

        {permissions.includes("dosen.page") && (
          <NavLink 
            to="/admin/dosen" 
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Dosen
          </NavLink>
        )}

        {permissions.includes("matakuliah.page") && (
          <NavLink 
            to="/admin/matakuliah" 
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Mata Kuliah
          </NavLink>
        )}

        {permissions.includes("user.management.page") && (
          <NavLink 
            to="/admin/users"
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Manajemen User
          </NavLink>
        )}

        {permissions.includes("rencana-studi.page") && (
          <NavLink
            to="/admin/rencana-studi"
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Rencana Studi
          </NavLink>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;