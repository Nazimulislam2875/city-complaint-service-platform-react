import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaClipboardList,
    FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../services/BaseUrl";

const DeleteComplaint = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    toast.error("Please login first");
                    navigate("/login", { replace: true });
                    return;
                }

                const response = await fetch(`${BaseUrl}/complaints/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.detail || "Complaint not found");
                    return;
                }

                setComplaint(data);
            } catch (error) {
                console.error(error);
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id, navigate]);

    const handleDelete = async () => {
        try {
            setDeleting(true);

            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `${BaseUrl}/complaints/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to delete complaint"
                );
            }

            toast.success("Complaint deleted successfully");

            navigate("/complaints", { replace: true });
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Delete failed");
        } finally {
            setDeleting(false);
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
            <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <section className="min-h-[calc(100vh-140px)] bg-base-200/40 px-4 py-10">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8 text-center">

                        <FaClipboardList className="text-5xl text-base-content/30 mx-auto mb-4" />

                        <h1 className="text-2xl font-bold mb-2">
                            Complaint Not Found
                        </h1>

                        <p className="text-base-content/60 mb-6">
                            No complaint was found with ID #{id}.
                        </p>

                        <Link
                            to="/complaints"
                            className="btn btn-primary"
                        >
                            <FaArrowLeft />
                            Back to My Complaints
                        </Link>

                    </div>
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

                    <div className="bg-gradient-to-r from-error/10 to-warning/10 p-6 border-b border-base-300">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                            <div className="flex items-start gap-4">

                                <div className="w-12 h-12 rounded-xl bg-error text-error-content flex items-center justify-center shrink-0">
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

                            <span className={`${getStatusClass(complaint.status)} capitalize`}>
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

                                <span className={`${getPriorityClass(complaint.priority)} capitalize`}>
                                    {complaint.priority}
                                </span>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm text-base-content/60 mb-2">
                                    Category
                                </p>

                                <p className="font-medium capitalize">
                                    {complaint.category
                                        ? complaint.category.replace("_", " ")
                                        : "N/A"}
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

                        <div className="mt-6 flex gap-3">

                            <Link
                                to="/complaints"
                                className="btn btn-outline flex-1"
                            >
                                Cancel
                            </Link>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn btn-error text-white flex-1"
                            >
                                {deleting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        <FaTrash />
                                        Delete Complaint
                                    </>
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeleteComplaint;