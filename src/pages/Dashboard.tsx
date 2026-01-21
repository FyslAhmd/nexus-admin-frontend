import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  HiUsers,
  HiFolder,
  HiUserAdd,
  HiPlusCircle,
  HiTrendingUp,
  HiClock,
  HiCheckCircle,
  HiSparkles,
} from 'react-icons/hi';
import { useAppSelector, usePermissions } from '../hooks';
import { usersApi, projectsApi } from '../services';
import { UserStats, ProjectStats } from '../types';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const scaleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient, delay = 0 }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="glass-card p-6 group cursor-pointer shine-effect"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-dark-400 mb-1">{title}</p>
        <motion.p 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, type: 'spring', stiffness: 100 }}
        >
          {value}
        </motion.p>
      </div>
      <div className={`p-4 rounded-2xl ${gradient} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs text-dark-400">
      <HiTrendingUp className="w-4 h-4 mr-1 text-emerald-400" />
      <span className="text-emerald-400">Updated</span>
      <span className="ml-1">just now</span>
    </div>
  </motion.div>
);

// Quick Action Card Component
interface ActionCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ to, icon, title, description, gradient }) => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Link
      to={to}
      className="block glass-card p-5 group hover:border-primary-500/30 transition-all duration-300"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${gradient} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="font-semibold text-white group-hover:text-primary-400 transition-colors">
            {title}
          </p>
          <p className="text-sm text-dark-400">{description}</p>
        </div>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  </motion.div>
);

// Role Badge Component
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const getGradient = () => {
    switch (role) {
      case 'ADMIN':
        return 'bg-gradient-to-r from-rose-500 to-pink-500';
      case 'MANAGER':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  return (
    <motion.span 
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-white ${getGradient()} shadow-lg`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
    >
      <HiSparkles className="w-4 h-4 mr-1" />
      {role}
    </motion.span>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { isAdmin, canManageUsers } = usePermissions();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectResponse] = await Promise.all([
          projectsApi.getStats(),
        ]);

        if (projectResponse.success && projectResponse.data) {
          setProjectStats(projectResponse.data.stats);
        }

        // Only fetch user stats if admin
        if (isAdmin) {
          const userResponse = await usersApi.getStats();
          if (userResponse.success && userResponse.data) {
            setUserStats(userResponse.data.stats);
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full animate-spin border-t-primary-500 mx-auto" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary-500/30 mx-auto" />
          </div>
          <p className="mt-4 text-dark-400">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden glass-card p-8"
      >
        {/* Background gradient decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-cyan-600/20 opacity-50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-gradient">{user?.name}</span>! 👋
            </h1>
            <p className="text-dark-300 text-lg mb-4">
              Here's what's happening with your projects today.
            </p>
          </motion.div>
          <RoleBadge role={user?.role || 'STAFF'} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Projects"
          value={projectStats?.total || 0}
          icon={<HiFolder className="w-7 h-7 text-white" />}
          gradient="bg-gradient-to-br from-primary-500 to-primary-700"
          delay={0}
        />
        
        <StatCard
          title="Active Projects"
          value={projectStats?.active || 0}
          icon={<HiCheckCircle className="w-7 h-7 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          delay={0.1}
        />

        {isAdmin && (
          <>
            <StatCard
              title="Total Users"
              value={userStats?.total || 0}
              icon={<HiUsers className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-700"
              delay={0.2}
            />
            
            <StatCard
              title="Active Users"
              value={userStats?.active || 0}
              icon={<HiClock className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              delay={0.3}
            />
          </>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <HiSparkles className="w-6 h-6 mr-2 text-primary-400" />
            Quick Actions
          </h2>
          <p className="text-dark-400 text-sm mt-1">Common tasks you can perform</p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <ActionCard
            to="/projects"
            icon={<HiPlusCircle className="w-6 h-6 text-white" />}
            title="Create Project"
            description="Start a new project"
            gradient="bg-gradient-to-br from-primary-500 to-primary-700"
          />

          {canManageUsers && (
            <ActionCard
              to="/users"
              icon={<HiUserAdd className="w-6 h-6 text-white" />}
              title="Invite User"
              description="Add a team member"
              gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
            />
          )}

          <ActionCard
            to="/projects"
            icon={<HiFolder className="w-6 h-6 text-white" />}
            title="View Projects"
            description="See all projects"
            gradient="bg-gradient-to-br from-blue-500 to-indigo-700"
          />
        </motion.div>
      </motion.div>

      {/* Role-based Info */}
      {isAdmin && userStats && (
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <HiUsers className="w-6 h-6 mr-2 text-purple-400" />
              User Distribution
            </h2>
            <p className="text-dark-400 text-sm mt-1">Users by role</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {userStats.byRole.map((item, index) => (
              <motion.div
                key={item.role}
                variants={scaleVariants}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-2xl p-6 text-center group"
                style={{
                  background: item.role === 'ADMIN' 
                    ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)'
                    : item.role === 'MANAGER'
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <motion.p 
                  className="text-4xl font-bold text-white mb-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
                >
                  {item.count}
                </motion.p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  item.role === 'ADMIN' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : item.role === 'MANAGER'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {item.role}
                </span>
                
                {/* Decorative element */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    background: item.role === 'ADMIN' 
                      ? 'radial-gradient(circle, rgba(244, 63, 94, 0.5) 0%, transparent 70%)'
                      : item.role === 'MANAGER'
                      ? 'radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
