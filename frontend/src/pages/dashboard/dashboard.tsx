import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/auth-context";


export default function Dashboard() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.email} 👋</h1>
            <p className="text-gray-600 mb-6">This is your dashboard.</p>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}
