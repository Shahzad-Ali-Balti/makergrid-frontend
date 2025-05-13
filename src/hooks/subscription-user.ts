import { useAuth } from "./use-auth";

export function useSubscription() {
    const {user} = useAuth(); // however you're loading user
    return {
      isFree: user?.subscription_type === 'free',
      isMaker: user?.subscription_type === 'maker',
      isArtisan: user?.subscription_type === 'artisan',
    };
  }
  