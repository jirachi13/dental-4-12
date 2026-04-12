import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Brain,
  ClipboardList,
  LogOut,
  Stethoscope,
  Shield,
  Clipboard
} from 'lucide-react';
import { useEffect } from 'react';
import logoImage from 'figma:asset/e814ddf273032a96d26231b3f2e66cb992b86fda.png';

export const Root = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Define all 8 tabs
  const allTabs = [
    {
      id: 1,
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['dentist', 'dental_aide', 'school_admin', 'barangay_health', 'system_admin']
    },
    {
      id: 2,
      path: '/appointments',
      label: 'Appointments',
      icon: Calendar,
      roles: ['dentist', 'dental_aide', 'school_admin']
    },
    {
      id: 3,
      path: '/patients',
      label: 'Student Records',
      icon: Users,
      roles: ['dentist', 'dental_aide', 'school_admin', 'barangay_health']
    },
    {
      id: 4,
      path: '/dental-charts',
      label: 'Dental Chart / Health Records',
      icon: Stethoscope,
      roles: ['dentist', 'dental_aide']
    },
    {
      id: 5,
      path: '/treatment-records',
      label: 'Treatment Records',
      icon: Clipboard,
      roles: ['dentist', 'dental_aide']
    },
    {
      id: 6,
      path: '/ai-analytics',
      label: 'Predictive Module',
      icon: Brain,
      roles: ['dentist']
    },
    {
      id: 7,
      path: '/rpc',
      label: 'RPC Records',
      icon: Shield,
      roles: ['dentist', 'dental_aide']
    },
    {
      id: 8,
      path: '/audit',
      label: 'Audit Trail',
      icon: ClipboardList,
      roles: ['system_admin']
    },
  ];

  // Filter tabs by current user role
  const visibleTabs = allTabs.filter(tab => tab.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isTabActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const TabLink = ({ tab }: { tab: typeof allTabs[0] }) => {
    const isActive = isTabActive(tab.path);
    const Icon = tab.icon;

    return (
      <Link
        to={tab.path}
        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
          isActive
            ? 'bg-[#1E40AF] text-white'
            : 'text-gray-700 hover:bg-[#EFF6FF]'
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:block text-sm font-medium">{tab.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* LEFT TAB BAR */}
      <aside className="w-[60px] md:w-[200px] bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Barangay Tanyag" className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0" />
            <span className="hidden md:block text-xl font-bold text-[#1E40AF]">FLORAL</span>
          </div>
        </div>

        {/* Vertical Tabs */}
        <nav className="flex-1 overflow-y-auto py-2">
          {visibleTabs.map((tab) => (
            <TabLink key={tab.id} tab={tab} />
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="hidden md:block mb-3">
            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
            <div className="mt-1">
              <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded capitalize">
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:block text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-[60px] md:ml-[200px]">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
