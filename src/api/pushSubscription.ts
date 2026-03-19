import { axiosClient } from '@src/api/axios'
import { urlBase64ToUint8Array } from '@src/util/webPush'

// VAPID Public Key - typically loaded from import.meta.env.VITE_VAPID_PUBLIC_KEY
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

export const subscribeToListNotifications = async (
  listId: number
): Promise<void> => {
  // 1. Check if the browser supports Service Workers and Push API
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.error('Push notifications are not supported by this browser.')
    return
  }

  try {
    // 2. Register the Service Worker
    // Construct the correct URL dynamically based on Vite's environment
    const swFilename = import.meta.env.DEV ? 'src/sw.ts' : 'sw.js'
    const swUrl = `${import.meta.env.BASE_URL}/${swFilename}`

    // Register the Service Worker with the exact BASE_URL scope
    const registration = await navigator.serviceWorker.register(swUrl, {
      type: 'module',
      scope: import.meta.env.BASE_URL 
    })
    
    await navigator.serviceWorker.ready

    // 3. Subscribe the user to Push Notifications
    // This will trigger the browser's permission prompt if not already granted
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // Required for security reasons
      applicationServerKey: urlBase64ToUint8Array(
        VAPID_PUBLIC_KEY
      ) as unknown as BufferSource
    })

    // 4. Send the subscription object to our Django backend
    // We use the JSON representation of the PushSubscription object
    await axiosClient.post(
      `/shopping/lists/${listId}/subscribe/`,
      subscription.toJSON(),
      {
        headers: {
          // Ensure the token is attached (interceptors usually handle this,
          // but added here explicitly just in case)
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      }
    )

    const subscribedLists: number[] = JSON.parse(
      localStorage.getItem('subscribedLists') || '[]'
    )
    if (!subscribedLists.includes(listId)) {
      subscribedLists.push(listId)
      localStorage.setItem('subscribedLists', JSON.stringify(subscribedLists))
    }

    console.log('Successfully subscribed to notifications for list:', listId)
  } catch (error) {
    console.error('Failed to subscribe the user: ', error)
    // Handle user denying permission or network errors here
    throw error
  }
}

// ... existing code ...

export const unsubscribeFromListNotifications = async (
  listId: number
): Promise<void> => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    // Retrieve the active subscription for this device
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      // Send the specific endpoint to Django to delete the database record
      await axiosClient.post(
        `/shopping/lists/${listId}/unsubscribe/`,
        { endpoint: subscription.endpoint },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`
          }
        }
      )
    }

    // Remove the list ID from local storage to update the UI
    let subscribedLists: number[] = JSON.parse(
      localStorage.getItem('subscribedLists') || '[]'
    )
    subscribedLists = subscribedLists.filter((id) => id !== listId)
    localStorage.setItem('subscribedLists', JSON.stringify(subscribedLists))

    console.log('Successfully unsubscribed from list:', listId)
  } catch (error) {
    console.error('Failed to unsubscribe from the list: ', error)
    throw error
  }
}
