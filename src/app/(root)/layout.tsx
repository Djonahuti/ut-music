
import { PlayerProvider } from '@/lib/playerContext'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/AuthContext'


export default function RootLayout({
   children 
}: {
   children: React.ReactNode 
}) { 

  return (
          <PlayerProvider>
            <ResponsiveLayout>
             <AuthProvider>
              {children}
             </AuthProvider> 
              <Toaster />
            </ResponsiveLayout>
          </PlayerProvider>
  )
}
