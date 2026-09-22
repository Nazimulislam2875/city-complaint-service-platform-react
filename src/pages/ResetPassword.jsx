import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaCity, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../services/BaseUrl";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(location.state?.email || "");
    const [resetToken, setResetToken] = useState(location.state?.resetToken || "");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !resetToken || !newPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${BaseUrl}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    reset_token: resetToken,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Password reset failed");
            }

            toast.success("Password reset successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error.message);
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

                    <h1 className="text-2xl font-bold">Reset Password</h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Create a new password for your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="input input-bordered w-full mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Reset Token</label>
                        <input
                            type="text"
                            value={resetToken}
                            onChange={(e) => setResetToken(e.target.value)}
                            placeholder="Enter reset token"
                            className="input input-bordered w-full mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">New Password</label>

                        <div className="relative mt-1">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="input input-bordered w-full pl-9"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Reset Password"
                        )}
                    </button>

                </form>

                <div className="text-center mt-5">
                    <Link
                        to="/login"
                        className="text-sm text-primary hover:underline"
                    >
                        ← Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ResetPassword;