import { Link } from "react-router";

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Auth Demo</h1>
      <p className="mb-4">Follow the steps below to get started:</p>
      <ol className="list-decimal list-inside text-left mb-6 max-w-md">
        <li>Go to the <Link to="/register" className="text-blue-600 underline">Register</Link> page and create an account.</li>
        <li>After registering, you'll be redirected to <Link to="/login" className="text-blue-600 underline">Login</Link>.</li>
        <li>Login with your credentials.</li>
        <li>Once logged in, you'll be taken to the <Link to="/dashboard" className="text-blue-600 underline">Dashboard</Link>.</li>
        <li>You can then explore protected pages like <Link to="/profile" className="text-blue-600 underline">Profile</Link> or <Link to="/settings" className="text-blue-600 underline">Settings</Link> (if available).</li>
      </ol>
      <div className="flex gap-4">
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
        <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded">Register</Link>
      </div>
    </main>
  );
}
