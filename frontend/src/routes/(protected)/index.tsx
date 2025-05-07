
import { useUser } from "../../hooks/useUser";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/')({
    component: Dashboard,
})

// function Index() {
//     return (
//         <div className="p-2">
//             <h3>Welcome Home!</h3>
//         </div>
//     )
// }

function Dashboard() {

    const { user, loading } = useUser();

    // const handleLogout = () => {
    //     // logout();
    //     navigate("/login");
    // };

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.email} 👋</h1>
            <p className="text-gray-600 mb-6">This is your dashboard.</p>
            <button
                // onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}