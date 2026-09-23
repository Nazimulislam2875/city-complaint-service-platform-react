import { Link } from "react-router";
import { FaEye, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";

const ComplaintCard = ({ complaint, onDelete }) => {
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
        <div className="bg-base-100 rounded-2xl shadow border border-base-300 p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-bold text-lg line-clamp-2">
                    {complaint.title}
                </h2>

                <span className={getStatusClass(complaint.status)}>
                    {complaint.status}
                </span>
            </div>

            <p className="text-sm text-base-content/60 line-clamp-3 mb-4">
                {complaint.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-outline capitalize">
                    {complaint.category.replace("_", " ")}
                </span>

                <span className={getPriorityClass(complaint.priority)}>
                    {complaint.priority}
                </span>
            </div>

            <p className="text-sm text-base-content/60 mb-4 flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 shrink-0" />
                <span>{complaint.location}</span>
            </p>

            <div className="flex gap-2">
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
                            to={`/complaints/update/${complaint.id}`}
                            className="btn btn-sm btn-warning"
                            title="Edit Complaint"
                        >
                            <FaEdit />
                        </Link>

                        <Link
                            to={`/complaints/delete/${complaint.id}`}
                            className="btn btn-sm btn-error text-white"
                            title="Delete Complaint"
                        >
                            <FaTrash />
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default ComplaintCard;