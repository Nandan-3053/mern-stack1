import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card = ({ children, className = '', onClick, hoverable = false }: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-card p-6
        ${hoverable ? 'transition-shadow hover:shadow-card-hover' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;