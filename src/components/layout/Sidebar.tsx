import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome,
  HiUsers,
  HiFolder,
  HiLogout,
  HiX,
} from 'react-icons/hi';
import { useAppDispatch, useAppSelector, usePermissions } from '../../hooks';
import { logout } from '../../features/auth/authSlice';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { canViewUsers } = usePermissions();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { path: '/dashboard', icon: HiHome, label: 'Dashboard', show: true },
    { path: '/users', icon: HiUsers, label: 'Users', show: canViewUsers },
    { path: '/projects', icon: HiFolder, label: 'Projects', show: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  const sidebarContent = (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-screen w-72
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
              }}
            >
              <span className="text-white font-bold text-xl">N</span>
            </motion.div>
            <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              NexusAdmin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-dark-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
          {navItems
            .filter((item) => item.show)
            .map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                    ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-dark-400 hover:text-white'
                    }
                  `}
                  style={{
                    background: isActive(item.path)
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)'
                      : 'transparent',
                    borderLeft: isActive(item.path) ? '3px solid #3b82f6' : '3px solid transparent',
                  }}
                >
                  {!isActive(item.path) && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                      }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 mr-3 relative z-10 ${isActive(item.path) ? 'text-primary-400' : 'group-hover:text-primary-400'} transition-colors`} />
                  <span className="font-medium relative z-10">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-4 w-2 h-2 rounded-full bg-primary-400"
                      style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
        </nav>

        {/* User info & Logout */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center mb-4 p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <span className="text-white font-semibold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-dark-400">{user?.email}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-dark-400 hover:text-rose-400 rounded-xl transition-all duration-300 group"
            style={{ background: 'transparent' }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
              style={{ background: 'rgba(244, 63, 94, 0.1)' }}
            />
            <HiLogout className="w-5 h-5 mr-3 relative z-10" />
            <span className="font-medium relative z-10">Logout</span>
          </motion.button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(10, 15, 26, 0.8)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      {sidebarContent}
    </>
  );
};

export default Sidebar;
