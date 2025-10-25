// Minimal supabase client placeholder to avoid runtime errors in dev
// Replace with a real supabase-js client when credentials are available
export const supabase = {
  from: (_table: string) => ({
    update: (_values: any) => ({
      eq: async (_col: string, _val: any) => ({ data: null, error: null }),
    }),
  }),
};
