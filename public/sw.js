self.addEventListener('push', function(event) {
    // Default fallback values
    let title = "Aktualizacja listy zakupów";
    let body = "Jedna z Twoich list została zmieniona.";
    let url = "/";
    
    if (event.data) {
        const payload = event.data.json();
        title = payload.title || title;
        url = payload.url || url;
        
        // If we received the raw list title and timestamp from Django
        if (payload.list_title && payload.timestamp) {
            // JavaScript's Date object automatically converts the ISO string 
            // to the user's local device timezone.
            const localDate = new Date(payload.timestamp);
            
            // Format to 'YYYY-MM-DD HH:mm'
            const formattedTime = localDate.toLocaleString('pl-PL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Construct the final message exactly as you wanted
            body = `Lista ${payload.list_title} zaktualizowana - ${formattedTime}`;
        }
    }

    const options = {
        body: body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        data: url
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});