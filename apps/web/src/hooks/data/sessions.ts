import { useApi } from "../../api/useApi";
import { useQuery } from "@tanstack/react-query";

export const useSessions = () => {
  const api = useApi();
  return useQuery({
    queryKey: ["sessions"],
    queryFn: () => api.sessions.getSessions(),
  });
};

export const useSession = (sessionId: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => api.sessions.getSession(sessionId),
    enabled: !!sessionId, // Only fetch if sessionId is provided
  });
};
