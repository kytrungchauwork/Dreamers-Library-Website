import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  to, 
  onClick, 
  variant = 'primary', 
  size,
  className = '', 
  disabled,
  ...props 
}) => {
  let classes = "inline-flex items-center justify-center font-['Quicksand'] transition-all duration-200 whitespace-nowrap cursor-pointer"

  if (variant === 'primary')
    classes += " bg-[#007bff] text-white border border-[#007bff] hover:bg-[#0056b3] font-medium"
  else if (variant === 'ban')
    classes += " bg-[#dc3545] text-white border border-[#dc3545] hover:bg-[#c82333] focus:ring-red-400";
  else if (variant === 'unban')
    classes += " bg-[#198754] text-black border border-[#198754] hover:bg-green-600 focus:ring-green-300";
  else if (variant === 'delete')
    classes += " bg-[#dc3545] text-white border border-[#dc3545] hover:bg-[#c82333] focus:ring-red-400";

  else if (variant === 'danger')
    classes += " bg-[#dc3545] text-white border border-[#dc3545] hover:bg-[#c82333] font-medium"
  else if (variant === 'icon')
    classes += " bg-white text-[#333] border border-[#ccc] hover:bg-[#f0f0f0] rounded-full w-[40px] h-[40px] text-[18px] p-0"
  else if (variant === 'text')
    classes += " bg-transparent text-[#333] border-none p-0 rounded-none justify-start hover:text-[#007bff] font-medium"
  else 
    classes += " bg-white text-[#333] border border-[#ccc] font-medium"

  if (variant !== 'icon' && variant !== 'text')
    if (size === 'small')
      classes += " px-[12px] py-[5px] text-[13px] rounded-[15px] h-[32px]"
    else
      classes += " px-[20px] py-[10px] text-[16px] rounded-[20px]"
  
  if (variant === 'text')
    classes += " text-[16px]"

  if (className)
    classes += " " + className

  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )

  return (
    <button onClick={onClick} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  )
};

export default Button;