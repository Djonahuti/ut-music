'use client'
import AuthForm from '@/components/AuthForm'
import { AuthProvider } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

const SignIn = () => {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
    };
    logout();
  }, []);

  return (
    <section className="w-full max-w-sm md:max-w-3xl">
    <AuthProvider>
      <AuthForm type="sign-in" />
    </AuthProvider>        
    </section>
  )
}

export default SignIn