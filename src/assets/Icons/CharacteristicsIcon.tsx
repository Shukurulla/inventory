import type React from "react";

export const Characteristics = (props : React.SVGProps<SVGSVGElement>)=> {
    return (
      <svg
        width={props.width || '28'}
        height={props.height || '28'}
        viewBox="0 0 28 28"
        fill="none"
        {...props}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.66667 14C4.66667 9.60023 4.66667 7.40034 6.0335 6.03351C7.40034 4.66667 9.60023 4.66667 14 4.66667C18.3998 4.66667 20.5997 4.66667 21.9665 6.03351C23.3333 7.40034 23.3333 9.60023 23.3333 14C23.3333 18.3998 23.3333 20.5997 21.9665 21.9665C20.5997 23.3333 18.3998 23.3333 14 23.3333C9.60023 23.3333 7.40034 23.3333 6.0335 21.9665C4.66667 20.5997 4.66667 18.3998 4.66667 14Z"
          strokeWidth="1.5"
        />
        <path
          d="M8.16667 11.6667C8.16667 10.0168 8.16667 9.1918 8.67923 8.67923C9.19179 8.16667 10.0168 8.16667 11.6667 8.16667H16.3333C17.9833 8.16667 18.8082 8.16667 19.3208 8.67923C19.8333 9.1918 19.8333 10.0168 19.8333 11.6667V16.3333C19.8333 17.9833 19.8333 18.8082 19.3208 19.3208C18.8082 19.8333 17.9833 19.8333 16.3333 19.8333H11.6667C10.0168 19.8333 9.19179 19.8333 8.67923 19.3208C8.16667 18.8082 8.16667 17.9833 8.16667 16.3333V11.6667Z"
          strokeWidth="1.5"
        />
        <path
          d="M4.66667 10.5H2.33333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M25.6667 10.5H23.3333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M4.66667 17.5H2.33333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M25.6667 17.5H23.3333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10.5 23.3333L10.5 25.6667"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10.5 2.33333L10.5 4.66666"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M17.5 23.3333L17.5 25.6667"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M17.5 2.33333L17.5 4.66666"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
}