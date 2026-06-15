import ProtectedRoute from "./ProtectedRoute";

const UserRoute = () => {
  return <ProtectedRoute userOnly={true} />;
};

export default UserRoute;
