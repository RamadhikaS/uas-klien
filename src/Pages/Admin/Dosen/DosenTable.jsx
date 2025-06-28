import React from 'react';
import Button from "../../../Components/Button";
import { Link as RouterLink } from 'react-router-dom';

const DosenTable = ({ dosenList, onEdit, onDelete, canEdit, canDelete, isLoading }) => {
  if (isLoading && dosenList.length === 0) {
    return <p className="text-center text-gray-500 my-10">Memuat data...</p>;
  }
  if (!isLoading && (!dosenList || dosenList.length === 0)) {
    return <p className="text-center text-gray-500 my-4">Belum ada data dosen atau tidak ada hasil.</p>;
  }

  return (
    <div className="relative overflow-x-auto">
      {isLoading && dosenList.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-gray-700">Memperbarui data...</p>
        </div>
      )}
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left whitespace-nowrap">NIDN</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Nama Dosen</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Bidang Keahlian</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Max SKS</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
            {canEdit || canDelete ? (
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dosenList.map((dosen) => (
            <tr key={dosen.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 whitespace-nowrap">{dosen.nidn}</td>
              <td className="py-3 px-4 whitespace-nowrap">{dosen.namaDosen}</td>
              <td className="py-3 px-4 whitespace-nowrap">{dosen.bidangKeahlian}</td>
              <td className="py-3 px-4 text-left whitespace-nowrap">{dosen.max_sks}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dosen.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {dosen.status ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              {canEdit || canDelete ? (
                <td className="py-3 px-4 text-center whitespace-nowrap space-x-2">
                  {canEdit && (
                    <Button size="sm" variant="warning" onClick={() => onEdit(dosen)} className="text-xs">
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(dosen.id)} className="text-xs">
                      Hapus
                    </Button>
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DosenTable;