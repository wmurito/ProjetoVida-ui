import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPaciente, updatePaciente } from '../services/api';

export const usePaciente = (id) => {
    return useQuery({
        queryKey: ['paciente', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await getPaciente(id);
            return response.data;
        },
        enabled: !!id, // Only fetch if ID is provided
    });
};

export const useUpdatePaciente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await updatePaciente(id, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate both the individual patient query and the list of patients
            queryClient.invalidateQueries({ queryKey: ['paciente', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['pacientes'] });
        },
    });
};
