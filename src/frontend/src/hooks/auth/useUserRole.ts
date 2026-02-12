import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { UserRole } from '../../backend';

export function useUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserRole | 'guest'>({
    queryKey: ['userRole', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return 'guest' as const;
      try {
        return await actor.getCallerUserRole();
      } catch {
        return 'guest' as const;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000
  });
}
