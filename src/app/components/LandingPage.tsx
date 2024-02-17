// app/components/LandingPage.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';


interface Expert {
  map(arg0: (expert: any, index: any) => React.JSX.Element): React.ReactNode;
  name: string;
  description: string;
  imageUrl: string;
  initialPrompt: string;
  initialAnswer: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [experts, setExperts] = useState<Expert | null>(null);

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
    <div>
      <div>
        <h1 className="text-4xl font-bold text-center mt-24 md:mt-52">Willkommen bei classbot.ch</h1>
        <p className="text-center m-4">Melde dich über das Microsoft-Logo an und wähle eine Persönlichkeit aus, um eine Unterhaltung zu beginnen</p>
      </div>
      <div className="flex flex-wrap mt-8 items-center justify-center bg-white">
        {experts && experts.map((expert, index) => (
          <div key={index} className="p-4 m-4 border rounded-lg cursor-pointer w-80 bg-slate-50 hover:bg-slate-100" onClick={() => startChatWithExpert(expert)}>
            <img src={expert.imageUrl} alt={expert.name} className="w-32 h-32 rounded-full mx-auto"/>
            <h3 className="mt-4 text-lg font-bold">{expert.name}</h3>
            <p className="text-sm">{expert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
