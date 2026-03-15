import { axiosClient } from '@src/api/axios'
import { useMutation } from '@tanstack/react-query'

type Credentials = {
  username: string
  password: string
}

type LoginResponse = {
  token: string
}

const useLogin = () => {
  const postLogin = (args: Credentials): Promise<LoginResponse> =>
    axiosClient
      .post<LoginResponse>('/api/login/', {
        username: args.username,
        password: args.password
      })
      .then((response) => response.data)

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token)
    }
  })

  return {
    mutate: loginMutation.mutate,
    isSuccess: loginMutation.isSuccess,
    isError: loginMutation.isError
  }
}

export default useLogin
