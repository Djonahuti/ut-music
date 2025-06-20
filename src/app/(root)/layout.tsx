
import { PlayerProvider } from '@/lib/playerContext'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import { Toaster } from 'sonner'


export default function RootLayout({
   children 
}: {
   children: React.ReactNode 
}) { 

  return (
          <PlayerProvider>
            <ResponsiveLayout>
              {children}
              <Toaster />
            </ResponsiveLayout>
          </PlayerProvider>
  )
}
