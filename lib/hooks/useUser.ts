import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      let {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error || !data.user) {
          console.error(error);
          throw new Error("Error signing in anonymously");
        }
        user = data.user;
      }

      setUser(user);
    })();
  }, []);

  return user;
};
