import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import Layout            from './components/layout/Layout'
import LoginPage         from './pages/auth/LoginPage'
import DashboardPage     from './pages/dashboard/DashboardPage'
import PostsPage         from './pages/posts/PostsPage'
import CommentsPage      from './pages/comments/CommentsPage'
import MediaPage         from './pages/media/MediaPage'
import AnalyticsPage     from './pages/analytics/AnalyticsPage'
import LeadsPage         from './pages/leads/LeadsPage'
import UsersPage         from './pages/users/UsersPage'
import SeoPage           from './pages/seo/SeoPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import SettingsPage      from './pages/settings/SettingsPage'
import SubscribersPage   from './pages/subscribers/SubscribersPage'

function ProtectedRoute({ children, page }) {
  const { user, loading, hasPermission } = useAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div style={{ width:32, height:32, border:'3px solid var(--border)', borderTopColor:'var(--red)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (page && !hasPermission(page)) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard"     element={<ProtectedRoute page="dashboard"><DashboardPage /></ProtectedRoute>} />
        <Route path="/posts"         element={<ProtectedRoute page="posts"><PostsPage /></ProtectedRoute>} />
        <Route path="/comments"      element={<ProtectedRoute page="comments"><CommentsPage /></ProtectedRoute>} />
        <Route path="/media"         element={<ProtectedRoute page="media"><MediaPage /></ProtectedRoute>} />
        <Route path="/analytics"     element={<ProtectedRoute page="analytics"><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/leads"         element={<ProtectedRoute page="leads"><LeadsPage /></ProtectedRoute>} />
        <Route path="/users"         element={<ProtectedRoute page="users"><UsersPage /></ProtectedRoute>} />
        <Route path="/seo"           element={<ProtectedRoute page="seo"><SeoPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute page="notifications"><NotificationsPage /></ProtectedRoute>} />
        <Route path="/subscribers"   element={<ProtectedRoute page="subscribers"><SubscribersPage /></ProtectedRoute>} />
        <Route path="/settings"      element={<ProtectedRoute page="settings"><SettingsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
