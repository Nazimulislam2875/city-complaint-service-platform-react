import { useState } from "react";
import { Link } from "react-router";
import { FaCity, FaLock, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../services/BaseUrl";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { current_password, new_password } = formData;

        if (!current_password || !new_password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (new_password.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (current_password === new_password) {
            toast.error("New password must be different from current password");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            const response = await fetch(`${BaseUrl}/profile/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to change password");
            }

            toast.success("Password changed successfully");

            setFormData({
                current_password: "",
                new_password: "",
            });
        } catch (error) {
            toast.error(error.message || "Password change failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-base-200/40 px-4 py-8">

            <div className="w-full max-w-md">

                <Link
                    to="/profile"
                    className="btn btn-ghost btn-sm mb-4"
                >
                    <FaArrowLeft />
                    Back to Profile
                </Link>

                <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-7">

                    <div className="text-center mb-6">

                        <div className="w-12 h-12 mx-auto rounded-xl bg-primary text-primary-content flex items-center justify-center mb-3">
                            <FaCity className="text-xl" />
                        </div>

                        <h1 className="text-2xl font-bold">
                            Change Password
                        </h1>

                        <p className="text-sm text-base-content/60 mt-1">
                            Keep your CivicConnect account secure
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="text-sm font-medium">
                                Current Password
                            </label>

                            <div className="relative mt-1">

                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                                <input
                                    type="password"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className="input input-bordered w-full pl-9"
                                />

                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                New Password
                            </label>

                            <div className="relative mt-1">

                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                                <input
                                    type="password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="input input-bordered w-full pl-9"
                                />

                            </div>

                            <p className="text-xs text-base-content/50 mt-1">
                                Minimum 6 characters
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Change Password"
                            )}
                        </button>

                    </form>

                </div>

            </div>

        </section>
    );
};

export default ChangePassword;