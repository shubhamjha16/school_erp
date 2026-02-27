import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Sun, Moon, Bell, UserCircle, LogOut, Home, Users, BookOpen, CreditCard } from 'lucide-react';
import './ParentLayout.css';

const parentNav = [
    { name: 'Dashboard', path: '/parent', icon: Home },
    { name: 'My Children', path: '/parent/children', icon: Users },
    { name: 'Academics', path: '/parent/academics', icon: BookOpen },
    { name: 'Fee Status', path: '/parent/fees', icon: CreditCard },
];

export const ParentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(
        (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
    );
    const navigate = useNavigate();

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
    };

    return (
        <div className="parent-layout">
            <aside className={`parent-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="parent-sidebar-header">
                    <div className="parent-brand">
                        <div className="parent-brand-icon">P</div>
                        <span className="parent-brand-name">Parent Portal</span>
                    </div>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="parent-nav">
                    {parentNav.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/parent'}
                            className={({ isActive }) => `parent-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="parent-sidebar-footer">
                    <button className="parent-logout-btn" onClick={() => navigate('/login')}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

            <div className="parent-main-wrapper">
                <header className="parent-topbar">
                    <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={22} />
                    </button>
                    <h1 className="parent-topbar-title">Parent Portal</h1>
                    <div className="parent-topbar-actions">
                        <button onClick={toggleTheme} className="icon-btn" title="Toggle theme">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button className="icon-btn" title="Notifications">
                            <Bell size={20} />
                        </button>
                        <div className="parent-avatar">
                            <UserCircle size={28} />
                        </div>
                    </div>
                </header>
                <main className="parent-main-content">
                    <div className="parent-content-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
