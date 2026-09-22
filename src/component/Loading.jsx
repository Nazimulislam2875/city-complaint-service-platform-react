const Loading = ({ fullScreen = false }) => {
    return (
        <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "py-20"}`}>
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
};

export default Loading;