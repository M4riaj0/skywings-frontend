const AdminTable = () => {
  // Lista quemada de administradores (hardcoded)
  const admins = [
    { id: 1, name: 'Juan Lopez', email: 'juan.lopez@example.com' },
    { id: 2, name: 'María Medina', email: 'maria.medina@example.com' },
    { id: 3, name: 'Andrés Palacio', email: 'andres.palacio@example.com' },
  ];

  return (
    <div className="overflow-x-auto"> {/* Contenedor con scroll horizontal */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">ID</th>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Nombre</th>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Email</th>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 border-b text-sm text-gray-700">{admin.id}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{admin.name}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{admin.email}</td>
              <td className="px-6 py-4 border-b text-sm flex space-x-2">
                <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-200">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
