import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const authToken = localStorage.getItem('token')
  return authToken ? <Outlet /> : <Navigate to="sign-in" />
}

export default PrivateRoute
