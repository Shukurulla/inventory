import React from "react";

interface IconProps {
  color?: string;
  className?: string;
}

const GogglesIcon: React.FC<IconProps> = ({ color = "#6BD46B", className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12C2 9.23858 4.23858 7 7 7H17C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17H7C4.23858 17 2 14.7614 2 12Z" stroke={color} strokeWidth="1.5" />
      <path d="M18.3292 19.3354C18.5144 19.7059 18.9649 19.8561 19.3354 19.6708C19.7059 19.4856 19.8561 19.0351 19.6708 18.6646L18.3292 19.3354ZM18 17L17.3292 17.3354L18.3292 19.3354L19 19L19.6708 18.6646L18.6708 16.6646L18 17Z" fill={color} />
      <path d="M5.67082 19.3354C5.48558 19.7059 5.03507 19.8561 4.66459 19.6708C4.29411 19.4856 4.14394 19.0351 4.32918 18.6646L5.67082 19.3354ZM6 17L6.67082 17.3354L5.67082 19.3354L5 19L4.32918 18.6646L5.32918 16.6646L6 17Z" fill={color} />
      <path d="M8.5 12C8.5 12.8284 7.82843 13.5 7 13.5C6.17157 13.5 5.5 12.8284 5.5 12C5.5 11.1716 6.17157 10.5 7 10.5C7.82843 10.5 8.5 11.1716 8.5 12Z" stroke={color} strokeWidth="1.5" />
      <path d="M12 12H18.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17.5 4C17.5 4.55228 17.0523 5 16.5 5C15.9477 5 15.5 4.55228 15.5 4C15.5 3.44772 15.9477 3 16.5 3C17.0523 3 17.5 3.44772 17.5 4Z" fill={color} />
    </svg>
  </div>
);

export default GogglesIcon;
