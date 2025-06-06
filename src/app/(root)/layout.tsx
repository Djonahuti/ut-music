
import { PlayerProvider } from '@/lib/playerContext'
import ResponsiveLayout from '@/components/ResponsiveLayout'


export default function RootLayout({
   children 
}: {
   children: React.ReactNode 
}) { 

  return (
          <PlayerProvider>
            <ResponsiveLayout>{children}</ResponsiveLayout>
          </PlayerProvider>
  )
}
