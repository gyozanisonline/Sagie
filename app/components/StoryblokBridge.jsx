'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component loads the Storyblok Visual Editor bridge
// so edits in the Storyblok dashboard reflect live in the iframe preview
export default function StoryblokBridge({ storyId }) {
    const router = useRouter();

    useEffect(() => {
        // Only run in development / when inside the Storyblok iframe
        if (typeof window === 'undefined') return;

        const loadBridge = (callback) => {
            const existingScript = document.getElementById('storyblok-javascript-bridge');
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'storyblok-javascript-bridge';
                script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js';
                script.type = 'text/javascript';
                document.head.appendChild(script);
                script.onload = callback;
            } else {
                callback();
            }
        };

        loadBridge(() => {
            if (window.StoryblokBridge) {
                const bridge = new window.StoryblokBridge();
                // On save or publish → refresh
                bridge.on(['published', 'change'], () => {
                    router.refresh();
                });
                // On input (live field edits) → also refresh
                bridge.on('input', () => {
                    router.refresh();
                });
            }
        });
    }, [storyId, router]);

    return null;
}
