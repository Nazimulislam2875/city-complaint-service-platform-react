import { useState } from "react";
import { useNavigate } from "react-router";
import { FaCity, FaMapMarkerAlt, FaExclamationTriangle, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import BaseUrl from "../services/BaseUrl";


const CreateComplaint = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "road",
        location: "",
        priority: "medium",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, description, category, location, priority } = formData;

        if (!title || !description || !location) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (title.length < 3 || title.length > 100) {
            toast.error("Title must be between 3 and 100 characters");
            return;
        }

        if (description.length < 10 || description.length > 1000) {
            toast.error("Description must be between 10 and 1000 characters");
            return;
        }

        if (location.length < 3 || location.length > 200) {
            toast.error("Location must be between 3 and 200 characters");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            const response = await fetch(`${BaseUrl}/complaints/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    location,
                    priority,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to create complaint");
            }

            toast.success("Complaint submitted successfully");
            navigate("/complaints");
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-140px)] bg-base-200/40 px-4 py-8">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-7">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary text-primary-content flex items-center justify-center mb-3">
                        <FaCity className="text-xl" />
                    </div>

                    <h1 className="text-2xl font-bold">Report a Problem</h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Submit a complaint about a city service
                    </p>
                </div>

                <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6 md:p-7">

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="text-sm font-medium">Complaint Title</label>

                            <div className="relative mt-1">
                                <FaFileAlt className="absolute left-3 top-3.5 text-base-content/40 text-sm" />

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Example: Broken road near city market"
                                    className="input input-bordered w-full pl-9"
                                />
                            </div>

                            <p className="text-xs text-base-content/50 mt-1">
                                {formData.title.length}/100 characters
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the problem in detail..."
                                className="textarea textarea-bordered w-full mt-1 min-h-32"
                            />

                            <p className="text-xs text-base-content/50 mt-1">
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <div>
                                <label className="text-sm font-medium">Category</label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="select select-bordered w-full mt-1"
                                >
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
                            </div>

                            <div>
                                <label className="text-sm font-medium">Priority</label>

                                <div className="relative mt-1">
                                    <FaExclamationTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm z-10" />

                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="select select-bordered w-full pl-9"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div>
                            <label className="text-sm font-medium">Location</label>

                            <div className="relative mt-1">
                                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-base-content/40 text-sm" />

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Example: Mirpur 10, Dhaka"
                                    className="input input-bordered w-full pl-9"
                                />
                            </div>

                            <p className="text-xs text-base-content/50 mt-1">
                                {formData.location.length}/200 characters
                            </p>
                        </div>

                        <div className="pt-2 flex gap-3">

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="btn btn-outline flex-1"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex-1"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Submit Complaint"
                                )}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </section>
    );
};

export default CreateComplaint;