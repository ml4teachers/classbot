'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage() {
  const router = useRouter();
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    fetch('/experts.json')
      .then((response) => response.json())
      .then((data) => setExperts(data));
  }, []);

  const startChatWithExpert = (expert: any) => {
    const chatId = uuidv4();
    localStorage.setItem('selectedExpert', JSON.stringify(expert));
    router.push(`/chats/${chatId}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {experts.map((expert, index) => (
        <div key={index} className="p-4 m-4 border rounded-lg cursor-pointer w-80 h-72 bg-slate-50 hover:bg-slate-100" onClick={() => startChatWithExpert(expert)}>
          <img src={expert.imageUrl} alt={expert.name} className="w-32 h-32 rounded-full mx-auto"/>
          <h3 className="mt-4 text-lg font-bold">{expert.name}</h3>
          <p className="text-sm">{expert.description}</p>
        </div>
      ))}
    </div>
  );
}
