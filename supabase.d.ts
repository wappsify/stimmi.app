import "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  export type User = {
    id: string;
    email: string;
    user_metadata: {
      locale?: string;
    };
  };
}

declare module "@supabase/auth-js" {
  export type User = {
    id: string;
    email: string;
    user_metadata: {
      locale?: string;
    };
  };
}
