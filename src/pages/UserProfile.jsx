import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaUserCircle, FaEnvelope, FaUser, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";
import BaseUrl from "../services/BaseUrl";

const UserProfile = () => {
    const { user, getProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        firstname: "",
        lastname: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || "",
                username: user.username || "",
                firstname: user.firstname || "",
                lastname: user.lastname || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, username, firstname, lastname } = formData;

        if (!email || !username || !firstname || !lastname) {
            toast.error("Please fill in all fields");
            return;
        }

        if (username.length < 3) {
            toast.error("Username must be at least 3 characters");
            return;
        }

        if (firstname.length < 2 || lastname.length < 2) {
            toast.error("First and last name must be at least 2 characters");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            const response = await fetch(`${BaseUrl}/profile/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to update profile");
            }

            await getProfile(token);

            toast.success("Profile updated successfully");
            navigate("/profile");
        } catch (error) {
            toast.error(error.message || "Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-140px)] bg-base-200/40 px-4 py-8">
            <div className="max-w-2xl mx-auto">

                <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 text-center border-b border-base-300">
                        <FaUserCircle className="text-6xl mx-auto text-primary mb-3" />

                        <h1 className="text-2xl font-bold">
                            My Profile
                        </h1>

                        <p className="text-sm text-base-content/60 mt-1">
                            Manage your account information
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">

                        <div className="grid md:grid-cols-2 gap-4">

                            <div>
                                <label className="text-sm font-medium">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Email
                            </label>

                            <div className="relative mt-1">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input input-bordered w-full pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Username
                            </label>

                            <div className="relative mt-1">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input input-bordered w-full pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 pt-2">

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-xs text-base-content/50">
                                    Account Role
                                </p>

                                <p className="font-semibold capitalize mt-1">
                                    {user?.role || "user"}
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-xs text-base-content/50">
                                    Account Status
                                </p>

                                <p className="font-semibold text-success mt-1">
                                    {user?.is_active ? "Active" : "Inactive"}
                                </p>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-2"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <>
                                    <FaSave />
                                    Save Changes
                                </>
                            )}
                        </button>

                    </form>

                </div>

            </div>
        </section>
    );
};

export default UserProfile;