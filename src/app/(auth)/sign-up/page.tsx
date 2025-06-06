import AuthForm from '@/components/AuthForm'
import { AuthProvider } from '@/lib/AuthContext'

const SignUp = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
    <AuthProvider>
      <AuthForm type="sign-up" />
    </AuthProvider>
    </section>
  )
}

export default SignUp