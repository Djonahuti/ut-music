import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get user info by user id (uuid)
export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Sign in user with email and password
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Get user profile from users table
    const user = await getUserInfo({ userId: data.user.id });
    return user;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

// Sign up user and insert into users table
export const signUp = async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('User data is missing after sign up.');

    // Insert user profile into users table
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        email,
        fullName,
      },
    ]);
    if (insertError) throw insertError;

    // Optionally, return the user profile
    const user = await getUserInfo({ userId: data.user.id });
    return user;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

// Get currently logged in user
export async function getLoggedInUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const user = await getUserInfo({ userId: data.user.id });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// ...existing code...