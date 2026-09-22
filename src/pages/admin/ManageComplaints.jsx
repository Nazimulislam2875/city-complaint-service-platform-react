import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaSearch, FaEye, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../../services/BaseUrl";
import Loading from "../../component/Loading";
import EmptyState from "../../component/EmptyState";

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("newest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const pageSize = 8;

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("access_token");
            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (category) params.append("category", category);
            if (status) params.append("status", status);
            if (startDate) params.append("start_date", startDate);
            if (endDate) params.append("end_date", endDate);

            params.append("sort", sort);
            params.append("page", page);
            params.append("page_size", pageSize);

            const response = await fetch(
                `${BaseUrl}/admin/complaints?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to load complaints");
            }

            setComplaints(data.complaints || []);
            setTotalPages(data.total_pages || 1);
        } catch (error) {
            console.error(error);
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [search, category, status, sort, startDate, endDate, page]);

    const handleStatusUpdate = async (id, newStatus) => {
        const action = newStatus === "resolved" ? "resolve" : "reject";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} this complaint?`
        );

        if (!confirmed) return;

        try {
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

            fetchComplaints();
        } catch (error) {
            toast.error(error.message || "Status update failed");
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this complaint?"
        );

        if (!confirmed) return;

        try {
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

            if (complaints.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchComplaints();
            }
        } catch (error) {
            toast.error(error.message || "Delete failed");
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

    return (
        <section>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-3xl font-bold">
                        Manage Complaints
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        Review and manage citizen complaints.
                    </p>
                </div>

                <div className="badge badge-primary badge-lg">
                    Admin Panel
                </div>
            </div>

            <div className="bg-base-100 rounded-2xl shadow border border-base-300 p-4 mb-6">

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">

                    <div className="relative xl:col-span-2">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />

                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="input input-bordered w-full pl-10"
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                        className="select select-bordered w-full"
                    >
                        <option value="">All Categories</option>
                        <option value="road">Road</option>
                        <option value="water">Water</option>
                        <option value="electricity">Electricity</option>
                        <option value="garbage">Garbage</option>
                        <option value="drainage">Drainage</option>
                        <option value="street_light">Street Light</option>
                        <option value="traffic">Traffic</option>
                        <option value="internet">Internet</option>
                        <option value="other">Other</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="select select-bordered w-full"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                        className="select select-bordered w-full"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="priority">Priority</option>
                    </select>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setPage(1);
                        }}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setPage(1);
                        }}
                        className="input input-bordered w-full"
                    />

                </div>

            </div>

            {loading && <Loading />}

            {!loading && error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && complaints.length === 0 && (
                <EmptyState
                    title="No Complaints Found"
                    message="No complaints match your current filters."
                />
            )}

            {!loading && !error && complaints.length > 0 && (
                <div className="bg-base-100 rounded-2xl shadow border border-base-300 overflow-x-auto">

                    <table className="table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Citizen</th>
                                <th>Complaint</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {complaints.map((complaint) => (
                                <tr key={complaint.id}>

                                    <td className="font-semibold">
                                        #{complaint.id}
                                    </td>

                                    <td>
                                        <p className="font-semibold">
                                            {complaint.user_name}
                                        </p>

                                        <p className="text-xs text-base-content/50">
                                            @{complaint.username}
                                        </p>
                                    </td>

                                    <td className="min-w-48">
                                        <p className="font-semibold">
                                            {complaint.title}
                                        </p>

                                        <p className="text-xs text-base-content/50 line-clamp-2">
                                            {complaint.description}
                                        </p>
                                    </td>

                                    <td className="capitalize">
                                        {complaint.category.replace("_", " ")}
                                    </td>

                                    <td>
                                        <span className={getPriorityClass(complaint.priority)}>
                                            {complaint.priority}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={getStatusClass(complaint.status)}>
                                            {complaint.status}
                                        </span>
                                    </td>

                                    <td className="min-w-40">
                                        {complaint.location}
                                    </td>

                                    <td>
                                        <div className="flex gap-1">

                                            <Link
                                                to={`/admin/complaints/${complaint.id}`}
                                                className="btn btn-sm btn-outline"
                                                title="View"
                                            >
                                                <FaEye />
                                            </Link>

                                            {complaint.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(complaint.id, "resolved")}
                                                        className="btn btn-sm btn-success text-white"
                                                        title="Resolve"
                                                    >
                                                        <FaCheck />
                                                    </button>

                                                    <button
                                                        onClick={() => handleStatusUpdate(complaint.id, "rejected")}
                                                        className="btn btn-sm btn-warning"
                                                        title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                onClick={() => handleDelete(complaint.id)}
                                                className="btn btn-sm btn-error text-white"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}

            {!loading && !error && complaints.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-8">

                    <div className="join">

                        <button
                            className="join-item btn"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            «
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((number) => (
                            <button
                                key={number}
                                onClick={() => setPage(number)}
                                className={`join-item btn ${
                                    page === number ? "btn-primary" : ""
                                }`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            className="join-item btn"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            »
                        </button>

                    </div>

                </div>
            )}

        </section>
    );
};

export default ManageComplaints;