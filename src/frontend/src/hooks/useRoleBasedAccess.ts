import { EntityType } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";
import { useGetCallerUserProfile } from "./useQueries";

export type AppRole = "hotel" | "ngo" | "volunteer" | "admin" | "guest";

export interface RoleAccess {
  role: AppRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  showDonate: boolean;
  showVolunteer: boolean;
  showNgo: boolean;
  showAdmin: boolean;
  showHotel: boolean;
  canAccessHotelDashboard: boolean;
  canAccessNgoDashboard: boolean;
  canAccessVolunteerDashboard: boolean;
  canAccessAdminDashboard: boolean;
  redirectPath: string;
}

export function useRoleBasedAccess(): RoleAccess {
  // isInitializing: true while the auth client checks localStorage for a saved
  // session. We MUST include this in isLoading so RoleGuard never redirects
  // to login before knowing whether the user is authenticated.
  const { isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  // isLoading is true until:
  // 1. Auth initialisation is complete (stored session check done)
  // 2. The actor (anonymous or authenticated) has been created
  // 3. The user profile query has resolved
  const isLoading =
    isInitializing ||
    actorFetching ||
    profileLoading ||
    (!!actor && !isFetched);

  const isAuthenticated = !!actor && !actorFetching;

  let role: AppRole = "guest";
  if (userProfile) {
    switch (userProfile.entityType) {
      case EntityType.hotel:
        role = "hotel";
        break;
      case EntityType.ngo:
        role = "ngo";
        break;
      case EntityType.volunteer:
        role = "volunteer";
        break;
      case EntityType.admin:
        role = "admin";
        break;
    }
  }

  const redirectPath =
    role === "hotel"
      ? "/hotel-dashboard"
      : role === "ngo"
        ? "/ngo-dashboard"
        : role === "volunteer"
          ? "/volunteer-dashboard"
          : role === "admin"
            ? "/admin"
            : "/login";

  return {
    role,
    isLoading,
    isAuthenticated,
    showDonate: role === "hotel" || role === "admin",
    showVolunteer: role === "volunteer" || role === "admin",
    showNgo: role === "ngo" || role === "admin",
    showAdmin: role === "admin",
    showHotel: role === "hotel" || role === "admin",
    canAccessHotelDashboard: role === "hotel" || role === "admin",
    canAccessNgoDashboard: role === "ngo" || role === "admin",
    canAccessVolunteerDashboard: role === "volunteer" || role === "admin",
    canAccessAdminDashboard: role === "admin",
    redirectPath,
  };
}
