import { Outlet } from "react-router";
import SubNavbar from "../../components/sub-nav-bar";

export default function OutreachLayout() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <SubNavbar />
            <main className="w-full flex-1 p-4 flex items-start justify-center max-w-7xl">
                <Outlet />
            </main>
        </div>
    );
}
