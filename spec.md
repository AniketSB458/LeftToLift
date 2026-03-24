# Left2Lift – Authentication, Routing & Loading Fix

## Current State
App uses Internet Computer's Internet Identity (not JWT). Three critical bugs cause login loops, black screens, and infinite loading:

1. **`useActor` aggressive refetch** — `useEffect` calls both `invalidateQueries` AND `refetchQueries` whenever the actor changes. This causes all queries (including userProfile) to refetch with the anonymous actor before the authenticated identity loads, resulting in role = 'guest' → RoleGuard redirects to login even for authenticated users.

2. **`useRoleBasedAccess` missing init check** — `isLoading` does not account for `isInitializing` from `useInternetIdentity`. So during the ~200ms while Internet Identity checks localStorage, `isLoading = false`, role = 'guest', and RoleGuard redirects.

3. **`useInternetIdentity` re-init loop** — `authClient` is in the `useEffect` dependency array. After `setAuthClient()` runs inside the effect, the effect re-fires (the `cancelled` flag partially mitigates but does not eliminate this).

## Requested Changes (Diff)

### Add
- `isInitializing` guard in `useRoleBasedAccess` so RoleGuard always shows a spinner until Identity check completes

### Modify
- `useActor.ts`: Remove `refetchQueries` from the `useEffect` — keep only `invalidateQueries` (marks as stale; active queries auto-refetch)
- `useRoleBasedAccess.ts`: Include `isInitializing` from `useInternetIdentity` in the `isLoading` computation
- `useInternetIdentity.ts`: Remove `authClient` from `useEffect` deps (use a ref instead) to prevent re-initialization loop

### Remove
- `refetchQueries` call in `useActor` useEffect

## Implementation Plan
1. Fix `useInternetIdentity.ts` — replace `authClient` dep with a ref to prevent double-init
2. Fix `useActor.ts` — remove `refetchQueries`, keep only `invalidateQueries`
3. Fix `useRoleBasedAccess.ts` — add `isInitializing` to `isLoading`
