import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { FaPlus, FaClipboardList, FaClock, FaCheckCircle } from "react-icons/fa";
import BaseUrl from "../services/BaseUrl";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    const [total, setTotal] = useState(0);
    const [pending, setPending] = useState(0);
    const [resolved, setResolved] = useState(0);

    useEffect(() => {
        const fetchComplaintStats = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(
                    `${BaseUrl}/complaints/my?page=1&page_size=100`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to load complaint data");
                }

                const complaints = data.complaints || [];

                setTotal(data.total || 0);

                setPending(
                    complaints.filter(
                        (complaint) => complaint.status === "pending"
                    ).length
                );

                setResolved(
                    complaints.filter(
                        (complaint) => complaint.status === "resolved"
                    ).length
                );
            } catch (error) {
                console.error("Failed to load complaint stats:", error);
            }
        };

        fetchComplaintStats();
    }, []);

    return (
        <section className="bg-base-200/40 px-4 pt-4 pb-8">
            <div className="max-w-6xl mx-auto">

                <div className="mb-5">
                    <h1 className="text-3xl font-bold">
                        Welcome, {user?.firstname}!
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        Manage your complaints and track city services.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="bg-base-100 rounded-2xl p-5 shadow border border-base-300">
                        <FaClipboardList className="text-primary text-2xl mb-3" />
                        <p className="text-sm text-base-content/60">
                            Total Complaints
                        </p>
                        <h2 className="text-3xl font-bold mt-1">
                            {total}
                        </h2>
                    </div>

                    <div className="bg-base-100 rounded-2xl p-5 shadow border border-base-300">
                        <FaClock className="text-warning text-2xl mb-3" />
                        <p className="text-sm text-base-content/60">
                            Pending
                        </p>
                        <h2 className="text-3xl font-bold mt-1">
                            {pending}
                        </h2>
                    </div>

                    <div className="bg-base-100 rounded-2xl p-5 shadow border border-base-300">
                        <FaCheckCircle className="text-success text-2xl mb-3" />
                        <p className="text-sm text-base-content/60">
                            Resolved
                        </p>
                        <h2 className="text-3xl font-bold mt-1">
                            {resolved}
                        </h2>
                    </div>

                    <div className="bg-base-100 rounded-2xl p-5 shadow border border-base-300">
                        <FaPlus className="text-secondary text-2xl mb-3" />
                        <p className="text-sm text-base-content/60">
                            Create New
                        </p>

                        <Link
                            to="/complaints/create"
                            className="text-primary font-semibold mt-2 inline-block hover:underline"
                        >
                            Report a Problem →
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default UserDashboard;