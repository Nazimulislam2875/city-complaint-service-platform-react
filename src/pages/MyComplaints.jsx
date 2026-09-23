import { useEffect, useState } from "react";
import { FaSearch, FaHashtag } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../services/BaseUrl";
import ComplaintCard from "../component/ComplaintCard";
import Loading from "../component/Loading";
import EmptyState from "../component/EmptyState";

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const pageSize = 6;

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("access_token");

            if (!token) {
                throw new Error("Please login first");
            }

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (category) {
                params.append("category", category);
            }

            if (status) {
                params.append("status", status);
            }

            params.append("sort", sort);
            params.append("page", page);
            params.append("page_size", pageSize);

            const url = `${BaseUrl}/complaints/my?${params.toString()}`;

            console.log("My Complaints API:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            console.log("My Complaints Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to load complaints"
                );
            }

            setComplaints(data.complaints || []);
            setTotalPages(data.total_pages || 1);
        } catch (error) {
            console.error("My Complaints Error:", error);
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [search, category, status, sort, page]);

    const handleDelete = async (id) => {
        try {
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

            if (complaints.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchComplaints();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Delete failed");
        }
    };

    return (
        <section className="min-h-screen bg-base-200/40 px-4 py-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold">
                        My Complaints
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        Track and manage your submitted complaints.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-base-100 rounded-2xl shadow border border-base-300 p-4 mb-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">

                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />

                            <input
                                type="text"
                                placeholder="Search by title or complaint ID..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="input input-bordered w-full pl-10"
                            />
                        </div>

                        {/* Category */}
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

                        {/* Status */}
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

                        {/* Sort */}
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                            }}
                            className="select select-bordered w-full"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>

                    </div>
                </div>

                {/* Loading */}
                {loading && <Loading />}

                {/* Error */}
                {!loading && error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && complaints.length === 0 && (
                    <EmptyState
                        title="No Complaints Found"
                        message="You haven't submitted any complaints matching your search."
                    />
                )}

                {/* Complaints */}
                {!loading && !error && complaints.length > 0 && (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {complaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden"
                                >
                                    {/* Complaint ID */}
                                    <div className="px-5 pt-5">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                            <FaHashtag />
                                            Complaint ID: {complaint.id}
                                        </div>
                                    </div>

                                    {/* Existing Card */}
                                    <ComplaintCard
                                        complaint={complaint}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="join">

                                    <button
                                        className="join-item btn"
                                        disabled={page === 1}
                                        onClick={() =>
                                            setPage(page - 1)
                                        }
                                    >
                                        «
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    ).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() =>
                                                setPage(number)
                                            }
                                            className={`join-item btn ${
                                                page === number
                                                    ? "btn-primary"
                                                    : ""
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        className="join-item btn"
                                        disabled={page === totalPages}
                                        onClick={() =>
                                            setPage(page + 1)
                                        }
                                    >
                                        »
                                    </button>

                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </section>
    );
};

export default MyComplaints;