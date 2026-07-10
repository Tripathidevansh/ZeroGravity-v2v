import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSavedPlaces,
  createSavedPlace,
  deleteSavedPlace,
  type CreateSavedPlaceInput,
} from "@/features/destination-search/api/savedPlacesService";

export const SAVED_PLACES_QUERY_KEY = ["saved-places"] as const;

export function useSavedPlaces() {
  return useQuery({
    queryKey: SAVED_PLACES_QUERY_KEY,
    queryFn: fetchSavedPlaces,
  });
}

export function useCreateSavedPlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSavedPlaceInput) => createSavedPlace(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SAVED_PLACES_QUERY_KEY }),
  });
}

export function useDeleteSavedPlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSavedPlace(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SAVED_PLACES_QUERY_KEY }),
  });
}
