import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppDispatch, RootState } from '../store';
import {
  getProducts,
  setSelectedProduct,
} from '../store/slices/menuSlice';
import { addItemToOrder } from '../store/slices/orderSlice';
import type { Product } from '../types';

const Menu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { venueId } = useParams<{ venueId: string }>();
  const {
    products,
    loading,
    selectedProduct,
    error,
  } = useSelector((state: RootState) => state.menu);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    if (venueId) {
      dispatch(getProducts());
    }
  }, [dispatch, venueId]);

  const handleAddToCart = (product: Product) => {
    if (product.id) {
      dispatch(addItemToOrder({
        orderId: 'current',
        item: {
          productId: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          status: 'pending',
        },
      }));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-24 p-2 border rounded"
            />
            <span className="self-center">to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-24 p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold">${product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={product.status === 'out_of_stock'}
                >
                  {product.status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full"
            >
              <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
              <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => dispatch(setSelectedProduct(null))}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    dispatch(setSelectedProduct(null));
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={selectedProduct.status === 'out_of_stock'}
                >
                  {selectedProduct.status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
