import React from 'react';
import Button from "../../../Components/Button";
import { Link as RouterLink } from 'react-router-dom';

const DosenTable = ({ dosenList, onEdit, onDelete }) => {
  if (!dosenList || dosenList.length === 0) {
    return (
      <p className="text-center text-gray-500 my-4">Belum ada data dosen.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left whitespace-nowrap">NIDN</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Nama Dosen</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Bidang Keahlian</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
            <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dosenList.map((dosen) => (
            <tr key={dosen.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 whitespace-nowrap">{dosen.nidn}</td>
              <td className="py-3 px-4 whitespace-nowrap">{dosen.namaDosen}</td>
              <td className="py-3 px-4 whitespace-nowrap">{dosen.bidangKeahlian}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dosen.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {dosen.status ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              <td className="py-3 px-4 text-center whitespace-nowrap space-x-2">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => onEdit(dosen)}
                  className="text-xs"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(dosen.id)}
                  className="text-xs"
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DosenTable;