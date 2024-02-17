// app/page.tsx

import React from 'react';
import LandingPage from "@/app/components/LandingPage"
import Header from "@/app/components/Header"
import ChatLayout from '@/app/components/ChatLayout';
import ChatWindow from '@/app/components/ChatWindow';


const Page: React.FC = () => {
  return (
    <ChatLayout>
      <Header />
      <LandingPage />
    </ ChatLayout>
  )
}

export default Page