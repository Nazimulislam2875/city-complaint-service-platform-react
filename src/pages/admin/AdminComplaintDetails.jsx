import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { FaArrowLeft, FaUser, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaClipboardList, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../../services/BaseUrl";

const AdminComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchComplaint = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("access_token");

            const response = await fetch(`${BaseUrl}/admin/complaints/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to load complaint");
            }

            setComplaint(data);
        } catch (error) {
            console.error(error);
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        const action = newStatus === "resolved" ? "resolve" : "reject";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} this complaint?`
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);

            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `${BaseUrl}/admin/complaints/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || `Failed to ${action} complaint`);
            }

            toast.success(
                newStatus === "resolved"
                    ? "Complaint resolved successfully"
                    : "Complaint rejected successfully"
            );

            fetchComplaint();
        } catch (error) {
            toast.error(error.message || "Status update failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this complaint?"
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);

            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `${BaseUrl}/admin/complaints/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to delete complaint");
            }

            toast.success("Complaint deleted successfully");
            navigate("/admin/complaints");
        } catch (error) {
            toast.error(error.message || "Delete failed");
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "resolved") return "badge badge-success";
        if (status === "rejected") return "badge badge-error";
        return "badge badge-warning";
    };

    const getPriorityClass = (priority) => {
        if (priority === "urgent") return "badge badge-error";
        if (priority === "high") return "badge badge-warning";
        if (priority === "low") return "badge badge-success";
        return "badge badge-info";
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="alert alert-error mb-5">
                    <span>{error}</span>
                </div>

                <Link to="/admin/complaints" className="btn btn-outline">
                    <FaArrowLeft />
                    Back to Complaints
                </Link>
            </div>
        );
    }

    return (
        <section>

            <Link
                to="/admin/complaints"
                className="btn btn-ghost btn-sm mb-5"
            >
                <FaArrowLeft />
                Back to Complaints
            </Link>

            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-base-300">

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                        <div className="flex items-start gap-4">

                            <div className="w-12 h-12 rounded-xl bg-primary text-primary-content flex items-center justify-center shrink-0">
                                <FaClipboardList className="text-xl" />
                            </div>

                            <div>
                                <p className="text-xs text-base-content/50">
                                    Complaint #{complaint.id}
                                </p>

                                <h1 className="text-2xl font-bold mt-1">
                                    {complaint.title}
                                </h1>
                            </div>

                        </div>

                        <span className={getStatusClass(complaint.status)}>
                            {complaint.status}
                        </span>

                    </div>

                </div>

                <div className="p-6">

                    <div className="mb-7">
                        <h2 className="text-lg font-bold mb-2">
                            Complaint Description
                        </h2>

                        <p className="text-base-content/70 leading-7">
                            {complaint.description}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="bg-base-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                                <FaUser />
                                Citizen
                            </div>

                            <p className="font-semibold">
                                {complaint.user_name}
                            </p>

                            <p className="text-sm text-base-content/50 mt-1">
                                @{complaint.username}
                            </p>
                        </div>

                        <div className="bg-base-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                                <FaEnvelope />
                                Email
                            </div>

                            <p className="font-medium break-all">
                                {complaint.email || "N/A"}
                            </p>
                        </div>

                        <div className="bg-base-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                                <FaMapMarkerAlt />
                                Location
                            </div>

                            <p className="font-medium">
                                {complaint.location}
                            </p>
                        </div>

                        <div className="bg-base-200 rounded-xl p-4">
                            <p className="text-sm text-base-content/60 mb-2">
                                Category
                            </p>

                            <p className="font-medium capitalize">
                                {complaint.category.replace("_", " ")}
                            </p>
                        </div>

                        <div className="bg-base-200 rounded-xl p-4">
                            <p className="text-sm text-base-content/60 mb-2">
                                Priority
                            </p>

                            <span className={getPriorityClass(complaint.priority)}>
                                {complaint.priority}
                            </span>
                        </div>

                        <div className="bg-base-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                                <FaCalendarAlt />
                                Created At
                            </div>

                            <p className="font-medium text-sm">
                                {formatDate(complaint.created_at)}
                            </p>
                        </div>

                    </div>

                    <div className="mt-4 bg-base-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                            <FaCalendarAlt />
                            Last Updated
                        </div>

                        <p className="font-medium text-sm">
                            {formatDate(complaint.updated_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-7">

                        {complaint.status === "pending" && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate("resolved")}
                                    disabled={actionLoading}
                                    className="btn btn-success text-white"
                                >
                                    {actionLoading ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            Resolve Complaint
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleStatusUpdate("rejected")}
                                    disabled={actionLoading}
                                    className="btn btn-warning"
                                >
                                    {actionLoading ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <>
                                            <FaTimes />
                                            Reject Complaint
                                        </>
                                    )}
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleDelete}
                            disabled={actionLoading}
                            className="btn btn-error text-white"
                        >
                            <FaTrash />
                            Delete Complaint
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default AdminComplaintDetails;