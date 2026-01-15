export default function AdminPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      <p className="text-gray-700">
        Welcome to the admin panel. Manage your application here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Users</h3>
          <p>1,245</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Movies</h3>
          <p>342</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Revenue</h3>
          <p>$4,560</p>
        </div>
      </div>
    </div>
  );
}
