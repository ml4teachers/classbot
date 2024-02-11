// src/components/Header.tsx
'use client'

import React from 'react';
import { AcademicCapIcon , UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();

  const handleHeaderClick = () => {
    router.push('/');
  }

  return (
    <div className="fixed left-4 bg-white h-14 w-full flex items-left justify-between text-gray-800">
      <div className="flex items-left cursor-pointer" onClick={handleHeaderClick} >
        <AcademicCapIcon className="w-9 mr-1"/>
        <h1 className="text-xl font-bold pt-3">classbot.ch</h1>
      </div>
    </div>
  );
};

export default Header;
