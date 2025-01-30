import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { QrCodeIcon, ClipboardDocumentListIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store';
import { getProducts } from '../store/slices/menuSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import toast, { Toaster } from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentTableCode = useSelector((state: RootState) => state.table.currentTableCode);
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const { products: allProducts } = useSelector((state: RootState) => state.menu);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Get 3 random products for featured section
  const featuredProducts = useMemo(() => {
    if (!allProducts.length) return [];
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [allProducts]);

  const handleStartOrder = () => {
    if (currentTableCode) {
      navigate(`/table/${currentTableCode}`);
    } else {
      navigate('/table/scan');
    }
  };

  const handleCallStacy = () => {
    toast.success('Stacy has been notified and will be with you shortly!', {
      icon: '👋',
      duration: 3000,
      style: {
        background: '#dedede',
        color: '#000',
        borderRadius: '10px',
      },
    });
  };

  const handleRefill = (text: string) => {
    toast.success(`${text}`, {
      icon: '🍹',
      duration: 3000,
      style: {
        background: '#dedede',
        color: '#000',
        borderRadius: '10px',
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-8">Welcome to Bottcierge</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scan QR Code */}
        <div
          onClick={handleStartOrder}
          className="glass-card p-6 cursor-pointer hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <QrCodeIcon className="w-8 h-8 text-electric-blue" />
            <h2 className="text-xl font-bold">
              {currentOrder ? "Continue with your order" : "Start a new Order"}
            </h2>
          </div>
          <p className="text-gray-300">
            {currentTableCode
              ? "Continue ordering for your current table"
              : "To start a new order, please enter or scan your table's QR code"
            }
          </p>
        </div>

        {/* View Orders */}
        <div
          onClick={() => navigate('/orders')}
          className="glass-card p-6 cursor-pointer hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <ClipboardDocumentListIcon className="w-8 h-8 text-neon-pink" />
            <h2 className="text-xl font-bold">View Orders</h2>
          </div>
          <p className="text-gray-300">
            Check your current and past orders
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleCallStacy}
            className="btn-primary"
          >
            Call Stacy
          </button>
          <button
            onClick={() => handleRefill('Ice is on the way!')}
            className="btn-secondary"
          >
            Refill Ice
          </button>
          <button
            onClick={() => handleRefill('Mixers are on the way!')}
            className="btn-secondary"
          >
            Refill Mixers
          </button>
          <button
            onClick={() => handleRefill('Ice & mixers are on the way!')}
            className="btn-secondary"
          >
            Refill Ice & Mixers
          </button>
        </div>
      </div>

      {/* Featured Drinks */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Drinks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-sky-500/25 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-light-blue/20 transition-colors"
                onClick={() => navigate(`/menu/${product.id}`)}
              >
                {product.image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {product.name}
                      </h3>
                      <p className="text-sm text-light-blue mt-1">
                        {product.description}
                      </p>
                      <div className="mt-2 space-y-1">
                        {product.sizes.map(size => (
                          <div key={size.id} className="flex justify-between text-sm">
                            <span className="text-light-blue">{size.name}</span>
                            <span className="text-white">${size.currentPrice?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center text-light-blue py-8">
              Loading featured drinks...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
