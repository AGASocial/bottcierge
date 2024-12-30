import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import type { AppDispatch, RootState } from '../store';
import { getProducts, getCategories, setSelectedProduct } from '../store/slices/menuSlice';
import { addItemToOrder, removeFromCart } from '../store/slices/orderSlice';
import type { Product, OrderItem } from '../types';

const Menu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { venueId } = useParams<{ venueId: string }>();
  const { products, loading, categories } = useSelector((state: RootState) => state.menu);
  const { currentVenue } = useSelector((state: RootState) => state.venue);
  const { cart, currentOrder } = useSelector((state: RootState) => state.order);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const handleAddToCart = (product: Product) => {
    const selectedSize = selectedSizes[product.id] || product.sizes[0].id;
    const size = product.sizes.find(s => s.id === selectedSize);
    
    if (!size || !currentOrder?.orderNumber) return;

    dispatch(addItemToOrder({
      orderId: currentOrder.id,
      item: {
        productId: product.id,
        name: `${product.name} (${size.name})`,
        quantity: 1,
        price: size.currentPrice,
        status: 'pending',
        sizeId: size.id,
        size: size.name
      }
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const getItemQuantityInCart = (productId: string) => {
    return cart.reduce((count, item) => (
      item.productId === productId ? count + item.quantity : count
    ), 0);
  };

  const scrollToCategory = (categoryId: string) => {
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth' });
    setActiveCategory(categoryId);
  };

  const renderQuantityControls = (product: Product) => {
    const quantity = getItemQuantityInCart(product.id);
    const cartItem = cart.find(item => item.productId === product.id);
    
    if (quantity > 0) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => cartItem && handleRemoveFromCart(cartItem.id)}
            className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="text-purple-900 font-medium">{quantity}</span>
          <button
            onClick={() => handleAddToCart(product)}
            className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <select
          value={selectedSizes[product.id] || product.sizes[0].id}
          onChange={(e) => setSelectedSizes(prev => ({ ...prev, [product.id]: e.target.value }))}
          className="block w-full px-2 py-1 text-sm rounded bg-purple-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {product.sizes.map(size => (
            <option key={size.id} value={size.id}>
              {size.name} - ${size.currentPrice.toFixed(2)}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleAddToCart(product)}
          className="w-full px-3 py-1 rounded-full bg-purple-600 text-white text-sm hover:bg-purple-700"
        >
          Add
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-purple-900">
      {/* Header */}
      <div className="bg-purple-800 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {currentVenue?.name || 'Menu'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-full bg-purple-700 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-purple-300 absolute left-3 top-2.5" />
              </div>
              <div className="relative">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t border-purple-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'text-white'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryProducts = products.filter(
                p => p.category === category.id && 
                (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              );
              
              if (categoryProducts.length === 0) return null;

              return (
                <div
                  key={category.id}
                  ref={el => categoryRefs.current[category.id] = el}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-white">{category.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-purple-800 rounded-lg shadow-lg overflow-hidden"
                      >
                        {product.image && (
                          <div className="aspect-w-16 aspect-h-9">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-white">
                                {product.name}
                              </h3>
                              <p className="text-sm text-purple-300 mt-1">
                                {product.description}
                              </p>
                              <div className="mt-2 space-y-1">
                                {product.sizes.map(size => (
                                  <div key={size.id} className="flex justify-between text-sm">
                                    <span className="text-purple-300">{size.name}</span>
                                    <span className="text-white">${size.currentPrice.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {renderQuantityControls(product)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
