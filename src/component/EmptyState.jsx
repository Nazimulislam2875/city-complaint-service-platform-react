import { FaClipboardList } from "react-icons/fa";

const EmptyState = ({ title = "No Data Found", message = "There is nothing to display." }) => {
    return (
        <div className="bg-base-100 rounded-2xl shadow border border-base-300 py-16 px-5 text-center">
            <FaClipboardList className="text-5xl mx-auto text-base-content/20 mb-4" />

            <h2 className="text-xl font-bold">
                {title}
            </h2>

            <p className="text-base-content/60 mt-1">
                {message}
            </p>
        </div>
    );
};

export default EmptyState;