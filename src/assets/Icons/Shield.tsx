import React from "react";

interface ShieldIconProps {
  color?: string;
  className?: string;
}

const ShieldIcon: React.FC<ShieldIconProps> = ({
  color = "#D9B88C",
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded ${className}`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 10C4 6.22876 4 4.34315 5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V13C20 16.7712 20 18.6569 18.8284 19.8284C17.6569 21 15.7712 21 12 21C8.22876 21 6.34315 21 5.17157 19.8284C4 18.6569 4 16.7712 4 13V10Z"
          stroke={color}
          strokeWidth="1.5"
        />
        <path d="M20 11.5H4" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export default ShieldIcon;
