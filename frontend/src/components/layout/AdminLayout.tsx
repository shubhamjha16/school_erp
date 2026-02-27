import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Building2, Users, BookOpen, Calendar, GraduationCap, CreditCard,
    LogOut, Menu, X, Bell, Sun, Moon, FileText, Shield, Activity
} from 'lucide-react';
import './AdminLayout.css';

const navItems = [
    { name: 'Dashboard', path: '/', icon: Building2 },
    { name: 'Onboarding', path: '/onboarding', icon: Users },
    { name: 'Academics (Terms/Classes)', path: '/academics', icon: BookOpen },
    { name: 'SIS: Guardians', path: '/guardians', icon: Users },
    { name: 'SIS: Students', path: '/students', icon: GraduationCap },
    { name: 'Attendance', path: '/attendance', icon: Calendar },
    { name: 'Communications', path: '/notifications', icon: Bell },
    { name: 'Exams & Marks', path: '/exams', icon: BookOpen },
    { name: 'Report Cards', path: '/reports', icon: FileText },
    { name: 'Fees Collections', path: '/fees', icon: CreditCard },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'Audit Logs', path: '/audit-logs', icon: Shield },
    { name: 'Notification Jobs', path: '/notification-jobs', icon: Activity },
];

export const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const navigate = useNavigate();

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo flex items-center gap-2">
                        <div className="logo-icon">SE</div>
                        <span className="logo-text text-primary font-bold">SchoolEye</span>
                    </div>
                    <button className="mobile-close btn-ghost" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={20} className="nav-icon" />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-link logout-btn" onClick={handleLogout}>
                        <LogOut size={20} className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                <header className="topbar">
                    <div className="flex items-center gap-4">
                        <button className="mobile-menu-btn btn-ghost" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className="page-title">Admin Portal</h2>
                    </div>

                    <div className="topbar-actions flex items-center gap-4">
                        <button className="icon-btn" onClick={toggleTheme}>
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="badge">3</span>
                        </button>
                        <div className="user-profile">
                            <div className="avatar">A</div>
                        </div>
                    </div>
                </header>

                <main className="main-content">
                    <div className="content-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
