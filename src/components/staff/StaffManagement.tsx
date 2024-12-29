import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import type { AppDispatch, RootState } from '../../store';
import { updateStaffStatus, fetchVenueMetrics } from '../../store/slices/venueSlice';
import type { Staff, Section } from '../../types';

interface StaffManagementProps {
  venueId: string;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ venueId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff, sections, metrics } = useSelector((state: RootState) => state.venue);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchVenueMetrics(venueId));
    }, 30000); // Update metrics every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, venueId]);

  const getStaffBySection = (sectionId: string) => {
    return staff.filter((s: Staff) => s.sections.includes(sectionId));
  };

  const handleStatusChange = async (staffId: string, status: Staff['status'], sectionId?: string) => {
    await dispatch(updateStaffStatus({ staffId, status, sectionId }));
  };

  const renderStaffMetrics = (staff: Staff) => {
    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="glass-card p-3">
          <div className="flex items-center space-x-2 text-electric-blue mb-1">
            <ChartBarIcon className="w-4 h-4" />
            <span className="text-sm">Rating</span>
          </div>
          <p className="text-xl font-bold">{staff.metrics.averageRating.toFixed(1)}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center space-x-2 text-electric-blue mb-1">
            <UserGroupIcon className="w-4 h-4" />
            <span className="text-sm">Orders</span>
          </div>
          <p className="text-xl font-bold">{staff.metrics.ordersServed}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center space-x-2 text-electric-blue mb-1">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span className="text-sm">Sales</span>
          </div>
          <p className="text-xl font-bold">${staff.metrics.salesVolume.toLocaleString()}</p>
        </div>
      </div>
    );
  };

  const renderStaffCard = (staff: Staff) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-4"
      key={staff.id}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{staff.firstName} {staff.lastName}</h3>
          <p className="text-gray-300 text-sm">{staff.role}</p>
        </div>
        <select
          value={staff.status}
          onChange={(e) => handleStatusChange(staff.id, e.target.value as Staff['status'])}
          className="input-field text-sm"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {renderStaffMetrics(staff)}
    </motion.div>
  );

  const sectionsList = sections.map((section: Section) => (
    <button
      key={section.id}
      onClick={() => setSelectedSection(section.id)}
      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
        selectedSection === section.id ? 'bg-electric-blue' : 'glass-card hover:bg-white/20'
      }`}
    >
      {section.name}
    </button>
  ));

  const staffCards = (selectedSection ? getStaffBySection(selectedSection) : staff).map((staffMember: Staff) => (
    renderStaffCard(staffMember)
  ));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Venue Metrics */}
      <motion.div
        initial={false}
        animate={{ height: showMetrics ? 'auto' : 0 }}
        className="overflow-hidden mb-8"
      >
        <div className="glass-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-electric-blue mb-2">
                <ChartBarIcon className="w-5 h-5" />
                <span>Active Orders</span>
              </div>
              <p className="text-3xl font-bold">{metrics.activeOrders}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-electric-blue mb-2">
                <ClockIcon className="w-5 h-5" />
                <span>Avg Wait Time</span>
              </div>
              <p className="text-3xl font-bold">{metrics.averageWaitTime}m</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-electric-blue mb-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span>Daily Revenue</span>
              </div>
              <p className="text-3xl font-bold">${metrics.revenue.daily.toLocaleString()}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-electric-blue mb-2">
                <UserGroupIcon className="w-5 h-5" />
                <span>Total Orders</span>
              </div>
              <p className="text-3xl font-bold">{metrics.totalOrders}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section Tabs */}
      <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
        <button
          onClick={() => setSelectedSection(null)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            !selectedSection ? 'bg-electric-blue' : 'glass-card hover:bg-white/20'
          }`}
        >
          All Staff
        </button>
        {sectionsList}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {staffCards}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StaffManagement;
