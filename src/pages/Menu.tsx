import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import type { AppDispatch, RootState } from '../store';
import { getProducts, getCategories, setSelectedProduct } from '../store/slices/menuSlice';
import { addItemToOrder, removeFromCart } from '../store/slices/orderSlice';
import type { Product, OrderItem } from '../types';
import { getImageUrl } from '../utils/imageUtils';

const Menu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { venueId } = useParams<{ venueId: string }>();
  const { products, loading, categories } = useSelector((state: RootState) => state.menu);
  const { currentVenue } = useSelector((state: RootState) => state.venue);
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});

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
    const defaultSize = product.sizes[0];
    const size = {
      id: defaultSize.id,
      name: defaultSize.name,
      currentPrice: defaultSize.currentPrice,
      isAvailable: defaultSize.isAvailable
    };

    if (!currentOrder?.orderNumber) return;

    dispatch(addItemToOrder({
      orderId: currentOrder.id,
      item: {
        productId: product.id,
        name: `${product.name} (${size.name})`,
        quantity: 1,
        price: defaultSize.currentPrice,
        totalPrice: defaultSize.currentPrice,
        size,
        options: {},
        status: 'pending'
      }
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const getItemQuantityInCart = (productId: string) => {
    return currentOrder?.items.reduce((count, item) => (
      item.productId === productId ? count + item.quantity : count
    ), 0);
  };

  const scrollToCategory = (categoryId: string) => {
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth' });
    setActiveCategory(categoryId);
  };

  const renderQuantityControls = (product: Product) => {
    if (!currentOrder) return null;

    const quantity = getItemQuantityInCart(product.id) || 0;
    const cartItem = currentOrder?.items.find(item => item.productId === product.id);

    if (quantity > 0) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => cartItem && handleRemoveFromCart(cartItem.id)}
            className="p-1 rounded-full bg-light-blue hover:bg-deep-blue text-white"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="text-deep-blue font-medium">{quantity}</span>
          <button
            onClick={() => handleAddToCart(product)}
            className="p-1 rounded-full bg-light-blue hover:bg-deep-blue text-white"
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
          className="block w-full px-2 py-1 text-sm rounded bg-deep-blue text-white border border-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue"
        >
          {product.sizes.map(size => (
            <option key={size.id} value={size.id}>
              {size.name} - ${size.currentPrice?.toFixed(2)}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleAddToCart(product)}
          className="w-full px-3 py-1 rounded-full bg-deep-blue text-white text-sm hover:bg-light-blue"
        >
          Add
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-deep-blue">
      {/* Header */}
      <div className="bg-deep-blue sticky top-0 z-10 shadow-lg">
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
                  className="w-64 pl-10 pr-4 py-2 rounded-full bg-deep-blue text-white placeholder-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-light-blue absolute left-3 top-2.5" />
              </div>
              <div
                className="relative cursor-pointer"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBagIcon className="h-6 w-6 text-white hover:text-light-blue transition-colors" />
                {currentOrder && currentOrder.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-light-blue text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                    {currentOrder.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t border-deep-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`text-sm font-medium whitespace-nowrap ${activeCategory === category.id
                    ? 'text-white'
                    : 'text-light-blue hover:text-white'
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
                        className="bg-sky-500/25 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-light-blue/20 transition-colors"
                        onClick={() => navigate(`/menu/${product.id}`)}
                      >
                        {product.image && (
                          <div className="aspect-w-16 aspect-h-9">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-128 object-cover"
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
