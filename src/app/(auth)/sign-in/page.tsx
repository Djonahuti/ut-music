import AuthForm from '@/components/AuthForm'
import { AuthProvider } from '@/lib/AuthContext'

const SignIn = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
    <AuthProvider>
      <AuthForm type="sign-in" />
    </AuthProvider>        
    </section>
  )
}

export default SignIn