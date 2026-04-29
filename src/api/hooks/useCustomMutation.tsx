import { axiosClient } from '@src/api/axios'
import type { HttpMethod } from '@src/util/types'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'

type UseCustomMutationProps = {
  method: HttpMethod
  url: string
  readonly mutationKey?: unknown[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (...args: any[]) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (...args: any[]) => any
}

const useCustomMutation = (props: UseCustomMutationProps) => {
  const getFetchFunc = useCallback(() => {
    if (props.method === 'POST') return axiosClient.post
    if (props.method === 'PUT') return axiosClient.put
    if (props.method === 'PATCH') return axiosClient.patch
    if (props.method === 'DELETE') return axiosClient.delete
    return axiosClient.get
  }, [props.method])

  // Accept variables directly in the mutation function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutationFunction = (variables?: any) => {
    const token = localStorage.getItem('authToken')
    const fetchFunc = getFetchFunc()

    const config = {
      headers: {
        Authorization: `Token ${token}`
      }
    }

    // IMPORTANT: Axios GET and DELETE have different method signatures than POST/PUT/PATCH
    // They don't take a 'body' argument as the second parameter.
    if (props.method === 'GET' || props.method === 'DELETE') {
      // For DELETE with body, you'd need { data: variables, headers: ... } inside config
      return fetchFunc(props.url, config)
    }

    // For POST, PUT, PATCH
    return fetchFunc(props.url, variables, config)
  }

  const mutation = useMutation({
    ...(props.mutationKey && { mutationKey: props.mutationKey }),
    mutationFn: mutationFunction,
    ...(props.onSuccess && { onSuccess: props.onSuccess }),
    ...(props.onError && { onError: props.onError })
  })

  const currentHttpStatus = 
    mutation.data?.status || 
    mutation.error?.response?.status

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    status: currentHttpStatus
  }
}

export default useCustomMutation
