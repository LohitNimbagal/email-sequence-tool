
import { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useNavigate } from "react-router";

export default function Register() {

    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email });
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

                <input
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
