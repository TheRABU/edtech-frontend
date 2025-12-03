import { useGetMeQuery } from "@/redux/features/auth/auth.api";

export const useAuth = () => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const isUnauthorized = isError && (error as any)?.status === 401;

  return {
    user: userData?.data,
    isAuthenticated: !!userData?.data && !isUnauthorized,
    isLoading,
    isError,
    error,
    refetch,
    isUnauthorized,
  };
};
