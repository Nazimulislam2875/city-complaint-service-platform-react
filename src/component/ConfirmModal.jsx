import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmModal = ({ open, title, message, confirmText = "Confirm", onConfirm, onCancel, loading = false }) => {
    if (!open) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-md">

                <div className="flex items-start gap-4">

                    <div className="w-11 h-11 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                        <FaExclamationTriangle />
                    </div>

                    <div>
                        <h3 className="font-bold text-lg">
                            {title}
                        </h3>

                        <p className="text-sm text-base-content/60 mt-1">
                            {message}
                        </p>
                    </div>

                </div>

                <div className="modal-action">

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="btn btn-error text-white"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            confirmText
                        )}
                    </button>

                </div>

            </div>

            <div
                className="modal-backdrop"
                onClick={onCancel}
            ></div>
        </dialog>
    );
};

export default ConfirmModal;