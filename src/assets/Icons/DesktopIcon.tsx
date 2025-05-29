import React from "react";

interface IconProps {
  color?: string;
  className?: string;
}

const DesktopIcon: React.FC<IconProps> = ({ color = "#000", className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <svg className="w-full h-full" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="26" />
      <path d="M20.44 16H31.55C35.11 16 36 16.89 36 20.44V26.77C36 30.33 35.11 31.21 31.56 31.21H20.44C16.89 31.22 16 30.33 16 26.78V20.44C16 16.89 16.89 16 20.44 16Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 31.22V36" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 27H36" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.5 36H30.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export default DesktopIcon;
