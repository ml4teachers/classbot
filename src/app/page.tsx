// src/app/page.tsx

import React from 'react';
import LandingPage from "@/app/components/LandingPage";
import Layout from '@/app/layout';

const Page: React.FC = () => {
  return (
    <Layout>
      <LandingPage />
    </Layout>
  );
}

export default Page;
