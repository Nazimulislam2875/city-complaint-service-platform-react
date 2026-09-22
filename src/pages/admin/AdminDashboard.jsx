import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle, FaPlus } from "react-icons/fa";
import BaseUrl from "../../services/BaseUrl";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        rejected: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("access_token");

                const response = await fetch(
                    `${BaseUrl}/admin/complaints?page=1&page_size=100`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to load dashboard data");
                }

                const complaints = data.complaints || [];

                setStats({
                    total: data.total || 0,
                    pending: complaints.filter((item) => item.status === "pending").length,
                    resolved: complaints.filter((item) => item.status === "resolved").length,
                    rejected: complaints.filter((item) => item.status === "rejected").length,
                });
            } catch (error) {
                console.error(error);
                setError(error.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    return (
        <section>

            <div className="mb-7">
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-base-content/60 mt-1">
                    Monitor and manage city complaints.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

                <div className="bg-base-100 rounded-2xl shadow border border-base-300 p-5">
                    <FaClipboardList className="text-primary text-2xl mb-3" />

                    <p className="text-sm text-base-content/60">
                        Total Complaints
                    </p>

                    <h2 className="text-3xl font-bold mt-1">
                        {stats.total}
                    </h2>
                </div>

                <div className="bg-base-100 rounded-2xl shadow border border-base-300 p-5">
                    <FaClock className="text-warning text-2xl mb-3" />

                    <p className="text-sm text-base-content/60">
                        Pending
                    </p>

                    <h2 className="text-3xl font-bold mt-1">
                        {stats.pending}
                    </h2>
                </div>

                <div className="bg-base-100 rounded-2xl shadow border border-base-300 p-5">
                    <FaCheckCircle className="text-success text-2xl mb-3" />

                    <p className="text-sm text-base-content/60">
                        Resolved
                    </p>

                    <h2 className="text-3xl font-bold mt-1">
                        {stats.resolved}
                    </h2>
                </div>

                <div className="bg-base-100 rounded-2xl shadow border border-base-300 p-5">
                    <FaTimesCircle className="text-error text-2xl mb-3" />

                    <p className="text-sm text-base-content/60">
                        Rejected
                    </p>

                    <h2 className="text-3xl font-bold mt-1">
                        {stats.rejected}
                    </h2>
                </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

                <Link
                    to="/admin/complaints"
                    className="bg-base-100 rounded-2xl shadow border border-base-300 p-6 hover:border-primary transition"
                >
                    <FaClipboardList className="text-primary text-3xl mb-3" />

                    <h2 className="text-xl font-bold">
                        Manage Complaints
                    </h2>

                    <p className="text-sm text-base-content/60 mt-1">
                        Review, filter, update and delete citizen complaints.
                    </p>
                </Link>

                <Link
                    to="/"
                    className="bg-base-100 rounded-2xl shadow border border-base-300 p-6 hover:border-primary transition"
                >
                    <FaPlus className="text-secondary text-3xl mb-3" />

                    <h2 className="text-xl font-bold">
                        Visit Website
                    </h2>

                    <p className="text-sm text-base-content/60 mt-1">
                        Return to the main CivicConnect website.
                    </p>
                </Link>

            </div>

        </section>
    );
};

export default AdminDashboard;