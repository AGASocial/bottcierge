import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../../store";
import { createServiceRequest } from "../../store/slices/serviceRequestSlice";
import { selectTable } from "../../store/slices/tableSlice";
import Dialog from "../common/Dialog";
import {
  UserIcon,
  CubeIcon,
  BeakerIcon,
  QuestionMarkCircleIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

interface QuickActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  showToast?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  onClick,
  icon,
  loading = false,
  showToast = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const handleClick = async () => {
    if (loading) return;

    // setIsAnimating(true);
    await onClick();
    if (showToast)
      toast.success("Request sent successfully!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#dedede",
          color: "#000",
          borderRadius: "10px",
        },
      });

    // setTimeout(() => {
    //   setIsAnimating(false);
    // }, 2000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white
        ${isAnimating ? "bg-electric-blue" : "bg-white/10"} 
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"}
        backdrop-blur-md border border-white/20
        transition-all duration-200`}
      animate={{
        scale: isAnimating ? 0.95 : 1,
      }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {loading ? "Sending..." : label}
    </motion.button>
  );
};

interface QuickActionsProps {
  tableId: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ tableId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.serviceRequest);
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const [showScanDialog, setShowScanDialog] = useState(false);

  const handleServiceRequest = async (type: string) => {
    await dispatch(createServiceRequest({ tableId, type }));
  };

  // Check if there's an active order
  const hasActiveOrder =
    currentOrder !== null &&
    ["pending", "preparing", "ready", "delivered"].includes(
      currentOrder.status
    );

  const quickActions = [
    {
      label: "Call Server",
      onClick: () => handleServiceRequest("server"),
      icon: <UserIcon className="h-5 w-5" />,
      alwaysShow: true,
      showToast: true,
    },
    {
      label: "Refill Ice",
      onClick: () => handleServiceRequest("ice"),
      icon: <CubeIcon className="h-5 w-5" />,
      alwaysShow: false,
      showToast: true,
    },
    {
      label: "Request Mixers",
      onClick: () => handleServiceRequest("mixers"),
      icon: <BeakerIcon className="h-5 w-5" />,
      alwaysShow: false,
      showToast: true,
    },
    {
      label: "Need Assistance",
      onClick: () => handleServiceRequest("assistance"),
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      alwaysShow: true,
      showToast: true,
    },
    {
      label: "Scan new Table",
      onClick: () => setShowScanDialog(true),
      icon: <QrCodeIcon className="w-6 h-6" />,
      alwaysShow: true,
      showToast: false,
    },
  ];

  // Filter actions based on order status
  const visibleActions = quickActions.filter(
    (action) => action.alwaysShow || hasActiveOrder
  );

  const handleScanNewTable = () => {
    dispatch(selectTable(null));
    navigate("/table/scan");
    setShowScanDialog(false);
  };

  return (
    <div className="glass-card p-6">
      <Dialog
        isOpen={showScanDialog}
        onClose={() => setShowScanDialog(false)}
        onConfirm={handleScanNewTable}
        title="Scan New Table"
        message="Are you sure you want to scan a new table? This will clear your current table selection."
        confirmText="Yes"
        cancelText="No"
        type="warning"
      />
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleActions.map((action) => (
          <QuickActionButton
            key={action.label}
            label={action.label}
            onClick={action.onClick}
            icon={action.icon}
            loading={loading}
            showToast={action.showToast}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
