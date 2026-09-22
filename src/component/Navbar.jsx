import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { FaBars, FaTimes, FaCity, FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
        setMenuOpen(false);
    };

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-semibold"
            : "hover:text-primary transition";

    return (
        <nav className="navbar bg-base-100/95 shadow-md sticky top-0 z-50 backdrop-blur">
            <div className="container mx-auto px-4 flex justify-between">

                <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                    <FaCity className="text-primary" />
                    <span>CityCare</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">

                    {user && (
                        <NavLink to="/" className={navLinkClass}>
                            Home
                        </NavLink>
                    )}

                    {user && (
                        <>
                            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                            <NavLink to="/complaints" className={navLinkClass}>My Complaints</NavLink>
                            <NavLink to="/complaints/create" className={navLinkClass}>Create Complaint</NavLink>
                        </>
                    )}

                    {user?.role === "admin" && (
                        <NavLink to="/admin/complaints" className={navLinkClass}>
                            Admin Panel
                        </NavLink>
                    )}

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <FaUserCircle className="text-2xl" />
                            </div>

                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li>
                                    <Link to="/profile">Profile</Link>
                                </li>
                                <li>
                                    <Link to="/change-password">Change Password</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-primary btn-sm">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-outline btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-ghost btn-circle md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-base-100 shadow-lg p-4">
                    <div className="flex flex-col gap-3">

                        {user && (
                            <NavLink
                                to="/"
                                className={navLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                        )}

                        {user && (
                            <>
                                <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                                    Dashboard
                                </NavLink>

                                <NavLink to="/complaints" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                                    My Complaints
                                </NavLink>

                                <NavLink to="/complaints/create" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                                    Create Complaint
                                </NavLink>

                                <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                                    Profile
                                </NavLink>

                                <NavLink to="/change-password" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                                    Change Password
                                </NavLink>
                            </>
                        )}

                        {user?.role === "admin" && (
                            <NavLink
                                to="/admin/complaints"
                                className={navLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                Admin Panel
                            </NavLink>
                        )}

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="btn btn-error btn-sm text-white"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to="/login"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="btn btn-outline btn-primary btn-sm"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;