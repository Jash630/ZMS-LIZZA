import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './Layout.css'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className={`layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="layout-main">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}