
import { type ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
    return (
        <div className="bg-white shadow rounded p-4 border">
            {children}
        </div>
    );
}
