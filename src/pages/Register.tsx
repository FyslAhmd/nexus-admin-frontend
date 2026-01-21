import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks';
import { register as registerUser, clearError } from '../features/auth/authSlice';
import { authApi } from '../services';
import { RegisterData, VerifyInviteResponse } from '../types';
import { 
  HiExclamationCircle, 
  HiCheckCircle, 
  HiUser, 
  HiLockClosed, 
  HiMail,
  HiArrowRight,
  HiEye,
  HiEyeOff,
  HiSparkles
} from 'react-icons/hi';

interface RegisterFormData {
  name: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const [inviteData, setInviteData] = useState<VerifyInviteResponse | null>(
    null
  );
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  // Verify invite token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setInviteError('No invitation token provided');
        setVerifying(false);
        return;
      }

      try {
        const response = await authApi.verifyInvite(token);
        if (response.success && response.data) {
          setInviteData(response.data);
        } else {
          setInviteError(response.message || 'Invalid invitation token');
        }
      } catch (err: any) {
        setInviteError(
          err.response?.data?.message || 'Failed to verify invitation token'
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    if (!token) return;

    const registerData: RegisterData = {
      token,
      name: data.name,
      password: data.password,
    };

    const result = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Registration successful! Welcome to NexusAdmin.');
      navigate('/dashboard', { replace: true });
    }
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'MANAGER':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full animate-spin border-t-primary-500 mx-auto" />
          </div>
          <p className="mt-4 text-dark-400">Verifying invitation...</p>
        </motion.div>
      </div>
    );
  }

  if (inviteError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card p-8 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center">
                <HiExclamationCircle className="w-12 h-12 text-rose-400" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Invalid Invitation
            </h2>
            <p className="text-dark-400 mb-8">{inviteError}</p>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-button inline-flex items-center space-x-2"
              >
                <span>Go to Login</span>
                <HiArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="text-center mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 relative"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
            }}
          >
            <span className="text-white font-bold text-4xl">N</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete <span className="text-gradient">Registration</span>
          </h1>
          <p className="text-dark-400">You've been invited to join NexusAdmin</p>
        </motion.div>

        {/* Register Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
        >
          {/* Invite Info */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl p-4 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <div className="flex items-center mb-3">
              <HiCheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="font-semibold text-emerald-400">Valid Invitation</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-dark-300">
                <HiMail className="w-4 h-4 mr-2 text-dark-500" />
                <span>{inviteData?.email}</span>
              </div>
              <div className="flex items-center">
                <HiSparkles className="w-4 h-4 mr-2 text-dark-500" />
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeStyles(inviteData?.role || '')}`}>
                  {inviteData?.role}
                </span>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field (disabled) */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-dark-500" />
                </div>
                <input
                  type="email"
                  value={inviteData?.email || ''}
                  disabled
                  className="glass-input pl-12 opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiUser className="h-5 w-5 text-dark-500" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`glass-input pl-12 ${errors.name ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Name cannot exceed 50 characters',
                    },
                  })}
                />
              </div>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-rose-400"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-dark-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className={`glass-input pl-12 pr-12 ${errors.password ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        'Password must contain uppercase, lowercase, and number',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-dark-500">Must contain uppercase, lowercase, and number</p>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-rose-400"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-dark-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`glass-input pl-12 pr-12 ${errors.confirmPassword ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-rose-400"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button w-full flex items-center justify-center space-x-2 btn-gradient-emerald disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 rounded-full animate-spin border-t-white" />
              ) : (
                <>
                  <span>Complete Registration</span>
                  <HiArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
