import { useState, useEffect } from "react";

/**
 * Hook to determine the current region ('india' or 'global')
 * based on the hostname where the app is running.
 */
export const useRegion = () => {
    const [region, setRegion] = useState("india"); // Default fallback

    useEffect(() => {
        // Determine the current hostname
        const hostname = window.location.hostname;
        const searchParams = new URLSearchParams(window.location.search);
        const queryRegion = searchParams.get('region');

        // 1. Check query parameter first (highest priority) and persist it
        if (queryRegion === 'global' || queryRegion === 'india') {
            setRegion(queryRegion);
            localStorage.setItem('userSelectedRegion', queryRegion);
            return;
        }

        // 2. Check localStorage (persisted choice)
        const persistedRegion = localStorage.getItem('userSelectedRegion');
        if (persistedRegion === 'global' || persistedRegion === 'india') {
            setRegion(persistedRegion);
            return;
        }

        // 3. In development mode, check dev-specific key
        if (import.meta.env.DEV) {
            const devRegion = localStorage.getItem('devPublicRegion');
            if (devRegion) {
                setRegion(devRegion);
                return;
            }
        }

        // 4. Fallback: Determine region based on hostname
        const globalDomains = [
            "global.y4d.ngo",
            "global.y4dinfo.org",
            "y4d-global.netlify.app",
            "global.localhost"
        ];

        const isGlobal = globalDomains.some(domain => hostname.includes(domain)) || hostname.startsWith("global.");

        setRegion(isGlobal ? "global" : "india");

    }, [window.location.search]);

    return region;
};

// Export a non-hook utility version for use outside React components (e.g., in Axios instances)
export const getActiveRegion = () => {
    // Safely check if window is defined (for SSR / static generation)
    if (typeof window === "undefined") return "india";

    const hostname = window.location.hostname;
    const searchParams = new URLSearchParams(window.location.search);
    const queryRegion = searchParams.get('region');

    // 1. Check query parameter
    if (queryRegion === 'global' || queryRegion === 'india') {
        localStorage.setItem('userSelectedRegion', queryRegion);
        return queryRegion;
    }

    // 2. Check localStorage
    const persistedRegion = localStorage.getItem('userSelectedRegion');
    if (persistedRegion === 'global' || persistedRegion === 'india') {
        return persistedRegion;
    }

    // 3. Dev check
    if (import.meta.env.DEV) {
        const devRegion = localStorage.getItem('devPublicRegion');
        if (devRegion) return devRegion;
    }

    // 4. Hostname fallback
    const globalDomains = [
        "global.y4d.ngo",
        "global.y4dinfo.org",
        "global.localhost"
    ];

    const isGlobal = globalDomains.some(domain => hostname.includes(domain)) || hostname.startsWith("global.");
    return isGlobal ? "global" : "india";
};
