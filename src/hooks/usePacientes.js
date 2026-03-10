import { useQuery } from '@tanstack/react-query';
import { getPacientes } from '../services/api';

export const usePacientes = (skip = 0, limit = 100) => {
    return useQuery({
        queryKey: ['pacientes', skip, limit],
        queryFn: async () => {
            const response = await getPacientes(skip, limit);
            // Ensure we return the array of patients
            const pacientesData = response.data || [];
            if (!Array.isArray(pacientesData)) {
                console.warn('Formato de dados inesperado:', pacientesData);
                return [];
            }
            return pacientesData;
        },
        // The query client defaults will handle staleTime, cacheTime, and retries.
    });
};
