import React from 'react';

interface BadgeProps {
  count: number;
  variant?: 'primary' | 'error' | 'warning';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ count, variant = 'primary', className = '' }) => {
  if (count === 0) return null;

  const variantClasses = {
    primary: 'bg-electric-blue',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className={`
      ${variantClasses[variant]}
      min-w-[20px]
      h-5
      flex
      items-center
      justify-center
      rounded-full
      text-xs
      font-medium
      text-white
      px-1.5
      ${className}
    `}>
      {count}
    </div>
  );
};

export default Badge;
