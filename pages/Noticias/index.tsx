"use client"
import TablaNoticias from '@/components/TableNoticias';
import BrandSidebar from '@/layouts/default';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/router';
import React from 'react';

const Index = () => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push('/NoticiasForm'); // Redirect to the news form page
  };

  return (
    <BrandSidebar>
      <Button onClick={handleRedirect} variant='shadow' color='primary' className='rounded mb-6'>
        Crea una Noticia
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Button>
      <TablaNoticias />
    </BrandSidebar>
  );
}

export default Index;
