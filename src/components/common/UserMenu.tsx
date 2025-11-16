import React, { useState } from 'react';
import { LogOut, User, Settings, ChevronDown, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import Dropdown from './Dropdown';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isDashboard = location.pathname.includes('dashboard');

  if (!user?.email) return null;

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      align="right"
      trigger={
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 
            transition-all group"
          aria-label="User menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Avatar email={user.email} size="sm" />
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      }
    >
      {/* User Email Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar email={user.email} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.email}
            </p>
            <p className="text-xs text-slate-500">
              Partner Member
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {/* Private Lounge / Home - Toggle based on location */}
        {!isDashboard ? (
          <button
            onClick={() => {
              navigate('/investor-dashboard');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 
              hover:bg-slate-50 transition-colors"
            role="menuitem"
          >
            <Lock className="w-4 h-4" />
            <span className="font-medium">Private Lounge</span>
          </button>
        ) : (
          <button
            onClick={() => {
              navigate('/');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 
              hover:bg-slate-50 transition-colors"
            role="menuitem"
          >
            <User className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </button>
        )}

        {/* Account - Coming Soon */}
        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 
            cursor-not-allowed"
          role="menuitem"
        >
          <User className="w-4 h-4" />
          <span>Account</span>
          <span className="ml-auto text-xs text-slate-400">Soon</span>
        </button>

        {/* Settings - Coming Soon */}
        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 
            cursor-not-allowed"
          role="menuitem"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
          <span className="ml-auto text-xs text-slate-400">Soon</span>
        </button>

        {/* Divider */}
        <div className="my-1 border-t border-slate-100" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 
            hover:bg-red-50 hover:text-red-700 transition-colors"
          role="menuitem"
          aria-label="Logout from dashboard"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </Dropdown>
  );
}

