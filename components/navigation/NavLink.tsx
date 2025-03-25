import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

export function NavLink({ href, children, mobile = false, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        font-medium transition-colors
        ${mobile 
          ? 'block py-2 text-white hover:text-blue-400' 
          : 'text-slate-300 hover:text-white'
        }
      `}
    >
      {children}
    </a>
  )
}
