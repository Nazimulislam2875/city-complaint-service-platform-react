import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
import BaseUrl from "../services/BaseUrl";

const ComplaintDetails = () => {
    const { id } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("access_token");

                const response = await fetch(`${BaseUrl}/complaints/${id}`, {
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

        fetchComplaint();
    }, [id]);

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
            <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <section className="min-h-[calc(100vh-140px)] bg-base-200/40 px-4 py-10">
                <div className="max-w-3xl mx-auto">
                    <div className="alert alert-error mb-5">
                        <span>{error}</span>
                    </div>

                    <Link to="/complaints" className="btn btn-outline">
                        <FaArrowLeft />
                        Back to My Complaints
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-[calc(100vh-140px)] bg-base-200/40 px-4 py-8">
            <div className="max-w-3xl mx-auto">

                <Link
                    to="/complaints"
                    className="btn btn-ghost btn-sm mb-5"
                >
                    <FaArrowLeft />
                    Back to My Complaints
                </Link>

                <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-base-300">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

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

                        <div className="mb-6">
                            <h2 className="font-semibold text-lg mb-2">
                                Description
                            </h2>

                            <p className="text-base-content/70 leading-7">
                                {complaint.description}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">

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
                                <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                                    <FaExclamationTriangle />
                                    Priority
                                </div>

                                <span className={getPriorityClass(complaint.priority)}>
                                    {complaint.priority}
                                </span>
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

                        {complaint.status === "pending" && (
                            <div className="flex gap-3 mt-6">

                                <Link
                                    to={`/complaints/edit/${complaint.id}`}
                                    className="btn btn-warning flex-1"
                                >
                                    Edit Complaint
                                </Link>

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </section>
    );
};

export default ComplaintDetails;