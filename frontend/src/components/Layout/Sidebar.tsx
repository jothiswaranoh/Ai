import {
  LayoutDashboard,
  FileText,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  X,
  Sprout,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DroneIcon } from '../Landing/DroneIcon';

export type AdminTab = 'dashboard' | 'bills' | 'farmers' | 'users';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Overview',
    },
    {
      id: 'bills' as AdminTab,
      label: 'All Bills',
      icon: FileText,
      badge: 'Billing',
    },
    {
      id: 'farmers' as AdminTab,
      label: 'Farmers',
      icon: Sprout, // Dedicated agricultural farmer logo
      badge: 'Agriculture',
    },
    {
      id: 'users' as AdminTab,
      label: 'Drone Pilots / Users',
      icon: DroneIcon, // Dedicated drone pilot logo
      badge: 'Flight Crew',
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setMobileOpen?.(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-transform md:transition-all duration-300 backdrop-blur-2xl bg-stone-950/95 border-r border-stone-800 flex flex-col justify-between w-64 ${
          collapsed ? 'md:w-20' : 'md:w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand & Toggle Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-stone-800">
            {/* Expanded brand on desktop or mobile drawer */}
            {(!collapsed || mobileOpen) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
                  <DroneIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold tracking-tight text-sm">Shamuga</h1>
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Admin Panel</p>
                </div>
              </div>
            )}

            {/* Collapsed icon for desktop */}
            {collapsed && !mobileOpen && (
              <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
                <DroneIcon className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Desktop collapse toggle button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen?.(false)}
              className="flex md:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick View Website Link */}
          <div className="p-3 pb-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-stone-400 hover:text-emerald-300 hover:bg-stone-900/80 border border-stone-800/60 transition-all text-xs font-medium group ${
                collapsed && !mobileOpen ? 'justify-center' : ''
              }`}
              title={collapsed && !mobileOpen ? "View Website" : undefined}
            >
              <Home className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              {(!collapsed || mobileOpen) && <span>View Marketing Website</span>}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 pt-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-950/30 font-semibold'
                      : 'text-stone-400 hover:text-white hover:bg-stone-900/60 border border-transparent'
                  }`}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                  {(!collapsed || mobileOpen) && (
                    <div className="flex items-center justify-between flex-1">
                      <span>{item.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'text-stone-500'}`}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-3 border-t border-stone-800/80">
          {(!collapsed || mobileOpen) && user && (
            <div className="mb-3 px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                  {user.full_name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-semibold truncate">{user.full_name || user.email}</p>
                  <p className="text-emerald-400 text-[10px] capitalize font-medium">{user.role}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-medium text-sm cursor-pointer"
            title={collapsed && !mobileOpen ? "Sign Out" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0 text-rose-400" />
            {(!collapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
