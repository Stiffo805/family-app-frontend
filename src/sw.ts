/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

import { initChangesDB, saveIncomingChange } from '@src/api/indexedDb'

// 1. Tell TypeScript that 'self' is a ServiceWorker
declare let self: ServiceWorkerGlobalScope

// 2. Define the exact shape of your incoming Django payload
export interface PushPayload {
  title?: string
  url?: string
  added_items?: any[] // You can replace 'any' with your specific Item type later
  changed_items?: any[] // e.g., ShoppingListEntry[]
  deleted_items?: any[]
  list_title?: string
  timestamp?: string
}

// --- Service Worker Lifecycle Management ---

self.addEventListener('install', () => {
    // Forces the waiting Service Worker to become the active Service Worker.
    // This bypasses the default "waiting" state completely.
    self.skipWaiting();
    console.log('New Service Worker installed and skipWaiting executed.');
});

self.addEventListener('activate', (event: ExtendableEvent) => {
    // Tells the active Service Worker to take immediate control of all open 
    // browser tabs (clients), rather than waiting for the next page reload.
    event.waitUntil(self.clients.claim());
    console.log('New Service Worker activated and claimed clients.');
});

// --- Push Event Handler ---

self.addEventListener('push', (event: PushEvent) => {
  // Wrap EVERYTHING inside a single event.waitUntil
  event.waitUntil(
    (async () => {
      // Default fallback values
      let title = 'Aktualizacja listy zakupów'
      let body = 'Jedna z Twoich list została zmieniona.'
      let url = '/'

      try {
        if (event.data) {
          // If this fails (invalid JSON), it jumps to the catch block,
          // preventing the whole worker from crashing!
          const payload = event.data.json() as PushPayload
          console.log(payload)

          title = payload.title || title
          url = payload.url || url

          // Format Date
          if (payload.list_title && payload.timestamp) {
            const localDate = new Date(payload.timestamp)
            const formattedTime = localDate.toLocaleString('pl-PL', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
            body = `Lista ${payload.list_title} zaktualizowana - ${formattedTime}`
          }

          // DB Operations
          const db = await initChangesDB()

          for (const item of payload.added_items || [])
            await saveIncomingChange(db, 'created', item)

          for (const item of payload.changed_items || [])
            await saveIncomingChange(db, 'updated', item)

          for (const item of payload.deleted_items || [])
            await saveIncomingChange(db, 'deleted', { ...item, id: undefined })

          console.log('Change saved to IndexedDB successfully.')

          // Notify React UI
          const clients = await self.clients.matchAll()

          clients.forEach((client) =>
            client.postMessage({ type: 'UPDATE_READY' })
          )
        }
      } catch (error) {
        // If JSON parsing or DB fails, log it clearly
        console.error('Failed to process push payload or update DB:', error)
        body = 'Lista została zmieniona, ale nie udało się pobrać szczegółów.'
      }

      // ALWAYS show a notification. Browsers will penalize your site
      // if you receive a push but don't show a notification.
      const options: NotificationOptions = {
        body: body,
        data: url,
        tag: 'shopping-list-update',
        silent: false
      }

      console.log('leci to')

      try {
        await self.registration.showNotification(title, options)
        console.log('Notification successfully passed to the browser.')
      } catch (e) {
        console.error('Browser rejected the notification:', e)
      }
    })()
  )
})

// --- Notification Click Handler ---

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()

  if (event.notification.data) {
    // Open the specific list URL when the user taps the notification
    event.waitUntil(self.clients.openWindow(event.notification.data))
  }
})
