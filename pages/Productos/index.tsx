import TablaProductos from '@/components/TablaProductos'
import BrandSidebar from '@/layouts/default'
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/router';
import React from 'react'

const index = () => {
    const router = useRouter();
    const handleRedirect = () => {
      router.push('/ProductosForm'); // Redirige a la página de cursos
    };
  return (
    <BrandSidebar>
          <Button onClick={handleRedirect} variant='shadow' color='primary' className='rounded mb-6'  >Agrega un Nuevo Producto<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
</Button>
    <TablaProductos/>
    </BrandSidebar>
  )
}

export default index