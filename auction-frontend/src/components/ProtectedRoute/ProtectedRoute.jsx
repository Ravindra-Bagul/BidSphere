import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserType }) => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (!userInfo) {
    // Not logged in, redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedUserType && userInfo.userType !== allowedUserType) {
    // Wrong user type, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
