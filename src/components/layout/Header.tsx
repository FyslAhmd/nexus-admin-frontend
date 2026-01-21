import React from 'react';
import { motion } from 'framer-motion';
import { HiMenuAlt2, HiSparkles } from 'react-icons/hi';
import { useAppSelector } from '../../hooks';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAppSelector((state) => state.auth);

  const getRoleBadgeStyles = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'MANAGER':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 glass-card rounded-none border-x-0 border-t-0"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 text-dark-400 hover:text-white hover:bg-white/10 rounded-xl mr-3 transition-all duration-200"
          >
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-white">
              Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>!
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${getRoleBadgeStyles()}`}
          >
            <HiSparkles className="w-4 h-4 mr-1.5" />
            {user?.role}
          </motion.span>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
