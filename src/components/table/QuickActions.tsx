import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createServiceRequest } from '../../store/slices/serviceRequestSlice';
import {
  UserIcon,
  CubeIcon,
  BeakerIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

interface QuickActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  label, 
  onClick, 
  icon,
  loading = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    
    setIsAnimating(true);
    await onClick();
    setShowNotification(true);

    // Reset animation after 2 seconds
    setTimeout(() => {
      setIsAnimating(false);
      setShowNotification(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={loading}
        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white
          ${isAnimating ? 'bg-electric-blue' : 'bg-white/10'} 
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}
          backdrop-blur-md border border-white/20
          transition-all duration-200`}
        animate={{
          scale: isAnimating ? 0.95 : 1,
        }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {loading ? 'Sending...' : label}
      </motion.button>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 bg-electric-blue text-white text-sm rounded-md text-center"
          >
            Request sent successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface QuickActionsProps {
  tableId: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ tableId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.serviceRequest);
  const { currentOrder } = useSelector((state: RootState) => state.order);

  const handleServiceRequest = async (type: string) => {
    await dispatch(createServiceRequest({ tableId, type }));
  };

  // Check if there's an active order
  const hasActiveOrder = currentOrder !== null && 
    ['pending', 'preparing', 'ready', 'delivered'].includes(currentOrder.status);

  const quickActions = [
    {
      label: 'Call Server',
      onClick: () => handleServiceRequest('server'),
      icon: <UserIcon className="h-5 w-5" />,
      alwaysShow: true,
    },
    {
      label: 'Refill Ice',
      onClick: () => handleServiceRequest('ice'),
      icon: <CubeIcon className="h-5 w-5" />,
      alwaysShow: false,
    },
    {
      label: 'Request Mixers',
      onClick: () => handleServiceRequest('mixers'),
      icon: <BeakerIcon className="h-5 w-5" />,
      alwaysShow: false,
    },
    {
      label: 'Need Assistance',
      onClick: () => handleServiceRequest('assistance'),
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      alwaysShow: true,
    },
  ];

  // Filter actions based on order status
  const visibleActions = quickActions.filter(
    action => action.alwaysShow || hasActiveOrder
  );

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleActions.map((action) => (
          <QuickActionButton
            key={action.label}
            label={action.label}
            onClick={action.onClick}
            icon={action.icon}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
