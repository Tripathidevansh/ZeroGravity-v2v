import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchReports, createReport, type CreateReportInput } from "@/features/community-reports/api/reportsService";

export const REPORTS_QUERY_KEY = ["community-reports"] as const;

export function useReports() {
  return useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: fetchReports,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReportInput) => createReport(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
    },
  });
}
