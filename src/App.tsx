import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import Landing from './pages/Landing'

// Account area is lazy-loaded — it never weighs on the public landing page.
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
// NOTE: /link is NOT a React route — it's served as a standalone static page
// (public/link.html, the real box-pairing page) via a rewrite in vercel.json.

function FullPageLoader() {
  return (
    <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: 'var(--color-cream)' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, opacity: 0.6 }}>loading…</span>
    </div>
  )
}

/** Gate for parent-only pages: waits for the session, then redirects if signed out. */
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
