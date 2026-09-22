import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const AdminProtected = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtected;