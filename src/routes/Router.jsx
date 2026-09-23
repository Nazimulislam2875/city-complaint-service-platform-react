import { createBrowserRouter } from "react-router";
import Root from "../layout/Root.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import SignUp from "../pages/SignUp.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import CreateComplaint from "../pages/CreateComplaint.jsx";
import MyComplaints from "../pages/MyComplaints.jsx";
import ComplaintDetails from "../pages/ComplaintDetails.jsx";
import EditComplaint from "../pages/EditComplaint.jsx";
import UserProfile from "../pages/UserProfile.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import AdminProtected from "./AdminProtected.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ManageComplaints from "../pages/admin/ManageComplaints.jsx";
import AdminComplaintDetails from "../pages/admin/AdminComplaintDetails.jsx";
import MyComplaintsPage from "../pages/MyComplaintsPage.jsx";
import DeleteComplaint from "../pages/DeleteComplaint.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoutes>
            <UserDashboard />
          </PrivateRoutes>
        ),
      },
      {
        path: "/complaints/create",
        element: (
          <PrivateRoutes>
            <CreateComplaint />
          </PrivateRoutes>
        ),
      },
      {
        path: "/complaints",
        element: (
          <PrivateRoutes>
            <MyComplaints />
          </PrivateRoutes>
        ),
      },
      {
        path: "/complaints/:id",
        element: (
          <PrivateRoutes>
            <ComplaintDetails />
          </PrivateRoutes>
        ),
      },
      {
        path: "/complaints/update/:id",
        element: (
          <PrivateRoutes>
            <EditComplaint />
          </PrivateRoutes>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoutes>
            <UserProfile />
          </PrivateRoutes>
        ),
      },
      {
        path: "/change-password",
        element: (
          <PrivateRoutes>
            <ChangePassword />
          </PrivateRoutes>
        ),
      },
      {
        path: "/complaints/my",
        element: (
          <PrivateRoutes>
            <MyComplaintsPage />
          </PrivateRoutes>
        ),
      },
      {
        path: "/complaints/delete/:id",
        element: (
          <PrivateRoutes>
            <DeleteComplaint />
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminProtected>
        <AdminLayout />
      </AdminProtected>
    ),
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "complaints",
        element: <ManageComplaints />,
      },
      {
        path: "complaints/:id",
        element: <AdminComplaintDetails />,
      },
    ],
  },
]);

export default router;
