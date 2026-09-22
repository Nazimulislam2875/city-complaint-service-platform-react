import { RouterProvider } from "react-router/dom";
import router from "./routes/Router";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </AuthProvider>
    );
};

export default App;