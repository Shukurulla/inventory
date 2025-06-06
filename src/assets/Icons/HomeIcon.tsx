import React from "react";

interface IconProps {
  color?: string;
  className?: string;
}

const HomeIcon: React.FC<IconProps> = ({ color = "#000", className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.36407 12.9581C1.98463 10.321 1.79491 9.0025 2.33537 7.87516C2.87583 6.74782 4.02619 6.06255 6.32691 4.69202L7.71175 3.86708C9.80104 2.6225 10.8457 2.00021 12 2.00021C13.1543 2.00021 14.199 2.6225 16.2882 3.86708L17.6731 4.69202C19.9738 6.06255 21.1242 6.74782 21.6646 7.87516C22.2051 9.0025 22.0154 10.321 21.6359 12.9581L21.3572 14.8954C20.8697 18.2829 20.626 19.9766 19.451 20.9884C18.2759 22.0002 16.5526 22.0002 13.1061 22.0002H10.8939C7.44737 22.0002 5.72409 22.0002 4.54903 20.9884C3.37396 19.9766 3.13025 18.2829 2.64284 14.8954L2.36407 12.9581Z" stroke={color} strokeWidth="1.5" />
      <path d="M15 18H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

export default HomeIcon;
