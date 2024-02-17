// src/components/Header.tsx
'use client'

import React, { useEffect } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import UserButton from './UserButton';
import { useTokens } from '../context/TokensContext';

const Header: React.FC = () => {
  const { totalTokens, updateTokens } = useTokens();
  const router = useRouter();

  const handleHeaderClick = () => {
    router.push('/');
  }

  useEffect(() => {
    updateTokens();
  }
  , []);


  return (
    <div className="fixed bg-white h-14 w-full flex items-center px-4 shadow-md">
      <div className="flex flex-1 items-center cursor-pointer" onClick={handleHeaderClick}>
        <AcademicCapIcon className="w-9 mr-2"/>
        <h1 className="text-xl pt-2 font-bold">classbot.ch</h1>
      </div>
      {totalTokens !== undefined &&
      <div className="hidden text-sm sm:block mr-6 text-slate-500">Gebrauchte Tokens: {totalTokens}</div>
      }
      <UserButton />
    </div>
  );
};

export default Header;
