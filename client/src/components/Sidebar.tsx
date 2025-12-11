import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Radio, Mic2, Map, Users, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: <Home />, label: "Dashboard", path: "/dashboard" },
        { icon: <Compass />, label: "Discover", path: "/discover" },
        { icon: <Radio />, label: "Mood Tuner", path: "/mood" },
        { icon: <Clock />, label: "Time Travel", path: "/time-travel" },
        { icon: <Mic2 />, label: "Aesthetic", path: "/aesthetic" },
        { icon: <Map />, label: "Vibe Teleporter", path: "/vibe" },
        { icon: <Users />, label: "Alternate You", path: "/alternate" },
    ];

    return (
        <div className="w-64 bg-black border-r border-white/10 h-screen p-6 flex flex-col fixed left-0 top-0 overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
                <img
                    src={user?.images[0]?.url || "https://via.placeholder.com/50"}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-spotify"
                />
                <span className="font-semibold text-white truncate">{user?.display_name}</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors mt-auto pt-6 border-t border-white/10"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
        ${active ? 'bg-spotify text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}
    `}>
        {icon}
        <span>{label}</span>
    </div>
);
