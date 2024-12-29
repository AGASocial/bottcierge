import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTables } from '../../store/slices/tableSlice';
import type { Table } from '../../types';
import type { AppDispatch, RootState } from '../../store';

interface TableMapProps {
  onTableSelect?: (table: Table) => void;
}

const TableMap: React.FC<TableMapProps> = ({ onTableSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tables } = useSelector((state: RootState) => state.table);

  useEffect(() => {
    dispatch(getTables());
  }, [dispatch]);

  const handleTableClick = (table: Table) => {
    if (onTableSelect) {
      onTableSelect(table);
    } else {
      navigate(`/table/${table.id}`);
    }
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'reserved':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => handleTableClick(table)}
          className={`p-4 rounded-lg border ${
            table.status === 'available'
              ? 'hover:border-blue-500 cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-bold mb-2">Table {table.number}</div>
            <div className="flex items-center justify-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${getTableStatusColor(
                  table.status
                )}`}
              />
              <span className="text-sm capitalize">{table.status}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Capacity: {table.capacity}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TableMap;
