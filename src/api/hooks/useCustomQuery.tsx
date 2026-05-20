import { axiosClient } from '@src/api/axios'
import { OfflineModeContext } from '@src/util/context'
import type { HttpMethod } from '@src/util/types'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useContext } from 'react'

type UseCustomQueryProps = {
  method: HttpMethod
  url: string
  readonly queryKey: unknown[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localStorageDownloadFunction?: (...args: any[]) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (...args: any[]) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (...args: any[]) => any
}

function useCustomQuery<T>(props: UseCustomQueryProps) {
  const offlineModeContext = useContext(OfflineModeContext)

  const getFetchFunc = useCallback(() => {
    if (props.method === 'POST') return axiosClient.post
    if (props.method === 'PUT') return axiosClient.put
    if (props.method === 'PATCH') return axiosClient.patch
    if (props.method === 'DELETE') return axiosClient.delete
    return axiosClient.get
  }, [props.method])

  // Accept variables directly in the mutation function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryFunction = async (variables?: any) => {
    if (offlineModeContext.offlineMode && props.localStorageDownloadFunction) {
      return new Promise((resolve) =>
        resolve(props.localStorageDownloadFunction?.() ?? null)
      )
    }

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
      return fetchFunc(props.url, config).then((response) => response.data)
    }

    // For POST, PUT, PATCH
    return fetchFunc(props.url, variables, config).then(
      (response) => response.data
    )
  }

  const query = useQuery({
    queryKey: props.queryKey,
    queryFn: queryFunction,
    ...(props.onSuccess && { onSuccess: props.onSuccess }),
    ...(props.onError && { onError: props.onError })
  })

  return {
    data: query.data as T | undefined | null,
    isLoading: query.isLoading,
    isError: query.isError
  }
}

export default useCustomQuery
