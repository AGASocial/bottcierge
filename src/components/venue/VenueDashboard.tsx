import React from 'react';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  UsersIcon,
  TableCellsIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import type { RootState } from '../../store';
import TableMap from '../table/TableMap';

const VenueDashboard: React.FC = () => {
  const { currentVenue } = useSelector((state: RootState) => state.venue);

  if (!currentVenue) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      name: 'Total Orders',
      value: '150',
      icon: ChartBarIcon,
    },
    {
      name: 'Active Tables',
      value: '8',
      icon: TableCellsIcon,
    },
    {
      name: 'Total Customers',
      value: '45',
      icon: UsersIcon,
    },
    {
      name: 'QR Scans',
      value: '234',
      icon: QrCodeIcon,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Venue Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentVenue.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">{currentVenue.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Map */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Table Map</h2>
        <TableMap />
      </div>
    </div>
  );
};

export default VenueDashboard;
