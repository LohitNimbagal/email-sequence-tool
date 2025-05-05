import { Navigate } from "react-router";
import { useAuth } from "../contexts/auth-context";

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {

    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    return <>{children}</>;
}
