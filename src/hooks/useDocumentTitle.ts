import { useEffect } from 'react';

/**
 * A custom hook to dynamically update the document title (browser tab title).
 * @param title The specific page title (e.g. "Hilton Hotel")
 * @param retainOnUnmount Whether to keep the title when the component unmounts
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    // We suffix the title with the App name for branding (SEO best practice)
    const newTitle = title ? `${title} | Booking Explore` : 'Booking Explore';
    document.title = newTitle;
    
    // Cleanup is generally not needed for SPAs tracking current active page
  }, [title]);
}
