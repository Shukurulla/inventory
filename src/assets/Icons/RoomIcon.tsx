import React from "react";

interface IconProps {
  color?: string;
  className?: string;
}

const RoomIcon: React.FC<IconProps> = ({ color = "#000", className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6V18M2 18H22M15 12H14.991M9 12H8.991M3 18H21L20.785 12.84C20.65 9.602 20.583 7.983 19.714 6.992C18.845 6 17.494 6 14.792 6H9.207C6.506 6 5.155 6 4.287 6.992C3.417 7.983 3.35 9.602 3.215 12.84L3 18Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export default RoomIcon;
