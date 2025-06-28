import React from 'react';
import Button from "../../../Components/Button"; 

const UserTable = ({ userList, onEditUser, canEdit }) => {
  if (!userList || userList.length === 0) {
    return (
      <p className="text-center text-gray-500 my-4">Belum ada data pengguna.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left whitespace-nowrap">ID</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Nama</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Email</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Role</th>
            {canEdit && ( 
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userList.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 whitespace-nowrap">{user.id}</td>
              <td className="py-3 px-4 whitespace-nowrap">{user.name}</td>
              <td className="py-3 px-4 whitespace-nowrap">{user.email}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                  {user.role}
                </span>
              </td>
              {canEdit && (
                <td className="py-3 px-4 text-center whitespace-nowrap space-x-2">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEditUser(user)}
                    className="text-xs"
                  >
                    Edit Role/Permission
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;