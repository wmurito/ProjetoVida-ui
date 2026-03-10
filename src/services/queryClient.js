import { QueryClient } from '@tanstack/react-query';

// Central configuration for React Query
// Customizing the default options to better suit our needs (stale-while-revalidate)
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Don't refetch on tab focus to save server load
            staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
            cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
            retry: 2, // Retry failed requests twice before throwing an error
        },
    },
});
