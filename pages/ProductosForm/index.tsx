import ProductoForm from '@/components/form/Producto'
import ProductoExtend from '@/components/form/ProductoExtend'
import BrandSidebar from '@/layouts/default'
import React from 'react'

const index = () => {
  return (
    <BrandSidebar>
    <ProductoExtend/>
    </BrandSidebar>
  )
}

export default index