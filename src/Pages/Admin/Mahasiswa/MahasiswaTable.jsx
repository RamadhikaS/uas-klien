import React from 'react';
import Button from "../../../Components/Button";
import { Link as RouterLink } from 'react-router-dom';

const MahasiswaTable = ({ mahasiswa, onEdit, onDelete, canEdit, canDelete, getTotalSks, isLoading }) => { 
  if (isLoading && mahasiswa.length === 0) { 
      return <p className="text-center text-gray-500 my-10">Memuat data...</p>;
  }
  if (!isLoading && (!mahasiswa || mahasiswa.length === 0)) {
    return <p className="text-center text-gray-500 my-4">Belum ada data mahasiswa atau tidak ada hasil.</p>;
  }

  return (
    <div className="relative overflow-x-auto"> 
      {isLoading && mahasiswa.length > 0 && ( 
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-gray-700">Memperbarui data...</p>
        </div>
      )}
      <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-left">Status</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {mahasiswa.map((mhs, index) => (
          <tr
            key={mhs.id}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{mhs.nim}</td>
            <td className="py-2 px-4">{mhs.nama}</td>
            <td className="py-2 px-4">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mhs.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {mhs.status ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </td>
            <td className="py-2 px-4 text-center space-x-2">
              <RouterLink
                to={`/admin/mahasiswa/${mhs.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Detail
              </RouterLink>
              {canEdit && (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => onEdit(mhs)}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(mhs.id)}
                >
                  Hapus
                </Button>
              )}
            </td>
          </tr>
        ))}
        {mahasiswa.length === 0 && (
          <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                  Tidak ada data mahasiswa.
              </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export default MahasiswaTable;