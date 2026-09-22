import { useState } from "react";
import { Link } from "react-router";
import { FaCity, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../services/BaseUrl";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${BaseUrl}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Something went wrong");
            }

            setResetToken(data.reset_token);
            toast.success("Reset token generated");
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

                    <h1 className="text-2xl font-bold">Forgot Password?</h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Enter your email to get a reset token
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm font-medium">Email</label>

                        <div className="relative mt-1">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            "Get Reset Token"
                        )}
                    </button>

                </form>

                {resetToken && (
                    <div className="mt-5">
                        <p className="text-sm font-semibold mb-2">
                            Reset Token
                        </p>

                        <div className="bg-base-200 rounded-lg p-3 text-xs break-all">
                            {resetToken}
                        </div>

                        <Link
                            to="/reset-password"
                            state={{ email, resetToken }}
                            className="btn btn-outline btn-primary btn-sm w-full mt-3"
                        >
                            Continue to Reset Password
                        </Link>
                    </div>
                )}

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

export default ForgotPassword;