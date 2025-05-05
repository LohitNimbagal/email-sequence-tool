
import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline";
};

export default function Button({ children, className, variant = "primary", ...props }: Props) {

    const base = "px-4 py-2 rounded font-medium transition flex items-center gap-2";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
    };

    return (
        <button className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
}
