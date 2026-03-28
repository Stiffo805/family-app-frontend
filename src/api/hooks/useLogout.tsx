import { axiosClient } from '@src/api/axios'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

const useLogout = () => {
  const navigate = useNavigate()

  const logout = () => {
    const token = localStorage.getItem('authToken')
    localStorage.removeItem('authToken')
    return axiosClient.post(
      '/api/logout/',
      {},
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    )
  }

  const navigateToLoginPage = () => navigate('/login')

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: navigateToLoginPage,
    onError: navigateToLoginPage
  })

  return {
    mutate: logoutMutation.mutate
  }
}

export default useLogout
