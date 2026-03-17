import { useState, useEffect } from 'react';

export const usePushStatus = (listId: number) => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // Check if browser supports notifications at all
        if (!('Notification' in window)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSubscribed(false);
            return;
        }

        // If the user blocked notifications at the system level, they aren't subscribed
        if (Notification.permission !== 'granted') {
            setIsSubscribed(false);
            return;
        }

        // Check our local storage array
        const subscribedLists: number[] = JSON.parse(localStorage.getItem('subscribedLists') || '[]');
        setIsSubscribed(subscribedLists.includes(listId));
        
    }, [listId]);

    return { isSubscribed, setIsSubscribed };
};