import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { FaCity, FaUser, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Please enter username and password");
            return;
        }

        try {
            setLoading(true);

            await login(username, password);

            toast.success("Login successful");

            navigate("/", { replace: true });
        } catch (error) {
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 bg-base-200/40">
            <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-300 p-7">

                <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary text-primary-content flex items-center justify-center mb-3">
                        <FaCity className="text-xl" />
                    </div>

                    <h1 className="text-2xl font-bold">
                        Welcome Back
                    </h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Login to your CivicConnect account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm font-medium">
                            Username
                        </label>

                        <div className="relative mt-1">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input input-bordered w-full pl-9"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Password
                        </label>

                        <div className="relative mt-1">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input input-bordered w-full pl-9"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>

                <div className="divider text-xs">
                    OR
                </div>

                <p className="text-center text-sm text-base-content/60">
                    Don't have an account?{" "}

                    <Link
                        to="/signup"
                        className="text-primary font-semibold hover:underline"
                    >
                        Create Account
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;