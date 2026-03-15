import { Navigate, Outlet } from 'react-router'

// Wrapper component to protect private routes
const ProtectedRoutes = () => {
  const authToken = localStorage.getItem('authToken')

  if (!authToken) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

export default ProtectedRoutes