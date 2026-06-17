'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FFFFFF',
              border: '1px solid #E8E6E1',
              color: '#1A1916',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 24px rgba(26,25,22,0.10)',
            },
            success: { iconTheme: { primary: '#2D7B4F', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#C0392B', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </SessionProvider>
  )
}
