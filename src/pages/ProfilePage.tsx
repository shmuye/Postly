import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Profile from "@/components/Profile";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Profile />;
};

export default ProfilePage;
