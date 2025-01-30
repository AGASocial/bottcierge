import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { RootState, AppDispatch } from '../store';
import { addItemToOrder } from '../store/slices/orderSlice';
import type { Product } from '../types';

interface CustomizationOption {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'select';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { products } = useSelector((state: RootState) => state.menu);
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const product = products.find(p => p.id === productId);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0]?.id || '');
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].id);
    }
    // TODO: Fetch customization options from backend
    // This is a mock example
    if (product?.category === 'bottle-list') {
      setCustomizationOptions([
        {
          id: 'mixers',
          name: 'Select Mixers',
          type: 'checkbox',
          required: false,
          options: [
            { id: 'coke', name: 'Coca Cola', price: 0 },
            { id: 'sprite', name: 'Sprite', price: 0 },
            { id: 'tonic', name: 'Tonic Water', price: 0 },
            { id: 'soda', name: 'Club Soda', price: 0 }
          ]
        },
        {
          id: 'ice',
          name: 'Ice Preference',
          type: 'radio',
          required: true,
          options: [
            { id: 'regular', name: 'Regular Ice', price: 0 },
            { id: 'light', name: 'Light Ice', price: 0 },
            { id: 'no', name: 'No Ice', price: 0 }
          ]
        }
      ]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-deep-blue p-4">
        <div className="text-white text-center">Product not found</div>
      </div>
    );
  }

  const handleOptionChange = (optionId: string, value: string | string[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!product || !currentOrder) return;

    const selectedSizeObj = product.sizes.find(s => s.id === selectedSize);
    if (!selectedSizeObj) return;

    try {
      await dispatch(addItemToOrder({
        orderId: currentOrder.id,
        item: {
          productId: product.id,
          name: product.name,
          quantity: 1,
          price: selectedSizeObj.currentPrice,
          totalPrice: selectedSizeObj.currentPrice,
          size: {
            id: selectedSizeObj.id,
            name: selectedSizeObj.name,
            currentPrice: selectedSizeObj.currentPrice,
            isAvailable: selectedSizeObj.isAvailable
          },
          options: selectedOptions,
          status: 'pending'
        }
      })).unwrap();
      navigate('/menu');
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-deep-blue p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center text-white mb-6 hover:text-light-blue"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Menu
        </button>

        <div className={`${currentOrder ? 'bg-deep-blue' : 'bg-sky-500/25'} rounded-lg shadow-lg overflow-hidden`}>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-light-blue mb-6">{product.description}</p>

            {currentOrder && (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-3">Select Size</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          selectedSize === size.id
                            ? 'border-light-blue bg-deep-blue'
                            : 'border-deep-blue hover:border-light-blue'
                        }`}
                      >
                        <div className="text-white font-medium">{size.name}</div>
                        <div className="text-light-blue">${size.currentPrice.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {customizationOptions.map(option => (
                  <div key={option.id} className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      {option.name}
                      {option.required && <span className="text-red-400 ml-1">*</span>}
                    </h2>
                    <div className="space-y-2">
                      {option.type === 'radio' && (
                        <div className="grid grid-cols-2 gap-3">
                          {option.options.map(choice => (
                            <label
                              key={choice.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                selectedOptions[option.id] === choice.id
                                  ? 'border-light-blue bg-deep-blue'
                                  : 'border-deep-blue hover:border-light-blue'
                              }`}
                            >
                              <input
                                type="radio"
                                name={option.id}
                                value={choice.id}
                                checked={selectedOptions[option.id] === choice.id}
                                onChange={e => handleOptionChange(option.id, e.target.value)}
                                className="sr-only"
                              />
                              <div className="text-white">{choice.name}</div>
                              {choice.price > 0 && (
                                <div className="text-light-blue">+${choice.price.toFixed(2)}</div>
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                      {option.type === 'checkbox' && (
                        <div className="grid grid-cols-2 gap-3">
                          {option.options.map(choice => (
                            <label
                              key={choice.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                (selectedOptions[option.id] as string[] || []).includes(choice.id)
                                  ? 'border-light-blue bg-deep-blue'
                                  : 'border-deep-blue hover:border-light-blue'
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={choice.id}
                                checked={(selectedOptions[option.id] as string[] || []).includes(choice.id)}
                                onChange={e => {
                                  const currentValues = (selectedOptions[option.id] as string[] || []);
                                  const newValues = e.target.checked
                                    ? [...currentValues, choice.id]
                                    : currentValues.filter(id => id !== choice.id);
                                  handleOptionChange(option.id, newValues);
                                }}
                                className="sr-only"
                              />
                              <div className="text-white">{choice.name}</div>
                              {choice.price > 0 && (
                                <div className="text-light-blue">+${choice.price.toFixed(2)}</div>
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {currentOrder ? (
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || (customizationOptions.some(opt => opt.required && !selectedOptions[opt.id]))}
                className="w-full py-3 px-4 bg-deep-blue text-white rounded-lg font-medium 
                  hover:bg-light-blue disabled:bg-deep-blue/50 disabled:cursor-not-allowed transition-colors"
              >
                Add to Order
              </button>
            ) : (
              <button
                onClick={() => navigate('/table/scan')}
                className="w-full py-3 px-4 bg-deep-blue text-white rounded-lg font-medium 
                  hover:bg-light-blue transition-colors"
              >
                Start New Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
