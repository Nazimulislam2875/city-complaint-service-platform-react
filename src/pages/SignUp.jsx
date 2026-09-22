import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { FaCity, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

const SignUp = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        firstname: "",
        lastname: "",
        password: "",
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

        const { email, username, firstname, lastname, password } = formData;

        if (!email || !username || !firstname || !lastname || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (username.length < 3) {
            toast.error("Username must be at least 3 characters");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            await signup(formData);

            toast.success("Account created successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 bg-base-200/40">
            <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-300 p-7">

                <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary text-primary-content flex items-center justify-center mb-3">
                        <FaCity className="text-xl" />
                    </div>

                    <h1 className="text-2xl font-bold">Create Account</h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Join CivicConnect today
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="First name"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="input input-bordered w-full mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Last name"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="input input-bordered w-full mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Email</label>

                        <div className="relative mt-1">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered w-full pl-9"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Username</label>

                        <div className="relative mt-1">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                            <input
                                type="text"
                                name="username"
                                placeholder="Choose username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input input-bordered w-full pl-9"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Password</label>

                        <div className="relative mt-1">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />

                            <input
                                type="password"
                                name="password"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input input-bordered w-full pl-9"
                            />
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
                            "Create Account"
                        )}
                    </button>

                </form>

                <div className="divider text-xs">OR</div>

                <p className="text-center text-sm text-base-content/60">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default SignUp;