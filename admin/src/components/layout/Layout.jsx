import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './Layout.css'

const MOBILE_BREAKPOINT = 1024

const isMobileViewport = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= MOBILE_BREAKPOINT
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(isMobileViewport)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = isMobileViewport()
      setIsMobile(nextIsMobile)
      if (!nextIsMobile) setMobileSidebarOpen(false)
      if (nextIsMobile) setCollapsed(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileSidebarOpen((current) => !current)
      return
    }
    setCollapsed((current) => !current)
  }

  const closeMobileSidebar = () => setMobileSidebarOpen(false)

  return (
    <div className={`layout ${collapsed && !isMobile ? 'sidebar-collapsed' : ''} ${isMobile ? 'layout-mobile' : ''}`}>
      <Sidebar
        collapsed={!isMobile && collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileSidebarOpen}
        onNavigate={closeMobileSidebar}
      />
      {isMobile && mobileSidebarOpen && (
        <button
          type="button"
          className="layout-backdrop"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
        />
      )}
      <div className="layout-main">
        <Header onMenuClick={handleMenuClick} isMobile={isMobile} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
