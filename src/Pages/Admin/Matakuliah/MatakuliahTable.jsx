import React from 'react';
import Button from "../../../Components/Button";

const MatakuliahTable = ({ matakuliahList, onEdit, onDelete, canEdit, canDelete, isLoading }) => {
  if (isLoading && matakuliahList.length === 0) {
    return <p className="text-center text-gray-500 my-10">Memuat data...</p>;
  }
  if (!isLoading && (!matakuliahList || matakuliahList.length === 0)) {
    return <p className="text-center text-gray-500 my-4">Belum ada data mata kuliah atau tidak ada hasil.</p>;
  }

  return (
    <div className="relative overflow-x-auto">
      {isLoading && matakuliahList.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-gray-700">Memperbarui data...</p>
        </div>
      )}
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left whitespace-nowrap">Kode MK</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Nama Mata Kuliah</th>
            <th className="py-3 px-4 text-center whitespace-nowrap">SKS</th>
            <th className="py-3 px-4 text-center whitespace-nowrap">Semester</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
            {canEdit || canDelete ? (
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {matakuliahList.map((mk) => (
            <tr key={mk.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 whitespace-nowrap">{mk.kodeMk}</td>
              <td className="py-3 px-4 whitespace-nowrap">{mk.namaMk}</td>
              <td className="py-3 px-4 text-center whitespace-nowrap">{mk.sks}</td>
              <td className="py-3 px-4 text-center whitespace-nowrap">{mk.semester}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mk.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {mk.status ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              {canEdit || canDelete ? (
                <td className="py-3 px-4 text-center whitespace-nowrap space-x-2">
                  {canEdit && (
                    <Button size="sm" variant="warning" onClick={() => onEdit(mk)} className="text-xs">
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(mk.id)} className="text-xs">
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

export default MatakuliahTable;