import { Outlet } from "react-router";
import Navbar from "./nav-bar";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
}
