// import { useState } from 'react';

import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

interface Admin {
    id: number;
    username: string;
    email: string;
  }
  
  interface AdminTableProps {
    admins: Admin[];
    onDeleteAdmin: (username: string) => void;
  }
  
  const AdminTable: React.FC<AdminTableProps> = ({ admins, onDeleteAdmin }) => {
    const numAdmin = (admins && admins.length) || 0;
    return (
      <div className="overflow-x-auto md:overflow-visible">
        {/*pantallas pequeñas */}
        <div className="md:hidden">
          {numAdmin === 0 ? (
            <p className="text-center text-gray-500">No hay administradores disponibles.</p>
          ) : (
            admins.map((admin, index) => (
              <div key={`${admin.id}-${numAdmin}-${index}`} className="border rounded p-4 mb-4 bg-white shadow">
                <p><strong>Nombre de Usuario:</strong> {admin.username}</p>
                <p><strong>Email:</strong> {admin.email}</p>
                <div className="flex justify-center mt-4">
                  <button 
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-200"
                    onClick={() => onDeleteAdmin(admin.username)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
  
        {/* pantallas grandes */}
        <table className="hidden md:min-w-full md:bg-white md:border md:border-gray-300 md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Nombre de Usuario</th>
              <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {numAdmin === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No hay administradores disponibles.
                </td>
              </tr>
            ) : (
              admins.map((admin, index) => (
                <tr key={`${admin.id}-${numAdmin}-${index}`} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{admin.username}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{admin.email}</td>
                  <td className="px-6 py-4 border-b text-sm flex space-x-2">
                  <Tooltip title="borrar">
                    <IconButton color="error"  size="small" aria-label="borrar" onClick={() => onDeleteAdmin(admin.username)}>
                      <Delete  />
                    </IconButton>
                  </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AdminTable;
  