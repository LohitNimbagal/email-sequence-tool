import { Link } from "react-router";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
            <p className="text-gray-600 mb-4">Page not found</p>
            <Link to="/" className="text-blue-600 hover:underline">
                Go back home
            </Link>
        </div>
    );
}
