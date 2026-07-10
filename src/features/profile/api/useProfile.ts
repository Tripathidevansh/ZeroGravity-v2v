import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyProfile,
  updateMyProfile,
  fetchMyContributionCount,
  fetchTrustedContacts,
  createTrustedContact,
  type CreateTrustedContactInput,
  type ProfileRow,
} from "@/features/profile/api/profileService";

export function useMyProfile() {
  return useQuery({ queryKey: ["profile", "me"], queryFn: fetchMyProfile });
}

export function useMyContributionCount() {
  return useQuery({ queryKey: ["profile", "contribution-count"], queryFn: fetchMyContributionCount });
}

export function useTrustedContacts() {
  return useQuery({ queryKey: ["trusted-contacts"], queryFn: fetchTrustedContacts });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Pick<ProfileRow, "full_name" | "avatar_url">>) => updateMyProfile(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", "me"] }),
  });
}

export function useCreateTrustedContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTrustedContactInput) => createTrustedContact(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trusted-contacts"] }),
  });
}
