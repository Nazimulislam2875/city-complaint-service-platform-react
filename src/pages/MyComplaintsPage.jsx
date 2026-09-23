
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaHashtag,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../services/BaseUrl";
import Loading from "../component/Loading";
import EmptyState from "../component/EmptyState";

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `${BaseUrl}/complaints/my?page=1&page_size=100&sort=newest`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load complaints");
      }

      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${BaseUrl}/complaints/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete complaint");
      }

      toast.success("Complaint deleted successfully");

      setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Delete failed");
    }
  };

  const getStatusClass = (status) => {
    if (status === "resolved") {
      return "badge badge-success";
    }

    if (status === "rejected") {
      return "badge badge-error";
    }

    return "badge badge-warning";
  };

  const getPriorityClass = (priority) => {
    if (priority === "urgent") {
      return "badge badge-error";
    }

    if (priority === "high") {
      return "badge badge-warning";
    }

    if (priority === "low") {
      return "badge badge-success";
    }

    return "badge badge-info";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="min-h-screen bg-base-200/50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-primary font-semibold text-sm mb-1">CITYCARE</p>

          <h1 className="text-3xl md:text-4xl font-bold text-base-content">
            My Complaints
          </h1>

          <p className="text-base-content/70 mt-2">
            View and manage all your submitted complaints.
          </p>
        </div>

        {loading && <Loading />}

        {!loading && error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && complaints.length === 0 && (
          <EmptyState
            title="No Complaints Found"
            message="You haven't submitted any complaints yet."
          />
        )}

        {!loading && !error && complaints.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-5 pb-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                      <FaHashtag />
                      <span>Complaint ID: {complaint.id}</span>
                    </div>

                    <span
                      className={`${getStatusClass(
                        complaint.status,
                      )} capitalize`}
                    >
                      {complaint.status === "resolved" && <FaCheckCircle />}

                      {complaint.status === "pending" && <FaClock />}

                      {complaint.status}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-base-content line-clamp-2 mb-2">
                    {complaint.title}
                  </h2>

                  <p className="text-sm text-base-content/70 line-clamp-3 min-h-[60px]">
                    {complaint.description}
                  </p>
                </div>

                <div className="px-5 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">
                      Category
                    </span>

                    <span className="badge badge-outline capitalize">
                      {complaint.category.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">
                      Priority
                    </span>

                    <span
                      className={`${getPriorityClass(
                        complaint.priority,
                      )} capitalize`}
                    >
                      {complaint.priority}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-base-content/70">
                    <FaMapMarkerAlt className="mt-1 shrink-0" />

                    <span className="line-clamp-2">{complaint.location}</span>
                  </div>

                  <div className="flex justify-between text-xs text-base-content/60 pt-1">
                    <span>Submitted</span>

                    <span>{formatDate(complaint.created_at)}</span>
                  </div>
                </div>

                <div className="border-t border-base-300 p-4 flex gap-2">
                  <Link
                    to={`/complaints/${complaint.id}`}
                    className="btn btn-sm btn-outline flex-1"
                  >
                    <FaEye />
                    View
                  </Link>

                  {complaint.status === "pending" && (
                    <>
                      <Link
                        to={`/complaints/edit/${complaint.id}`}
                        className="btn btn-sm btn-warning"
                        title="Edit Complaint"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="btn btn-sm btn-error text-white"
                        title="Delete Complaint"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyComplaintsPage;
