// components/TablaProductos.tsx
import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { useRouter } from 'next/router';
import { Button } from '@nextui-org/button';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  teacher: number;
}

const TablaProductos: React.FC = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      const productosCollection = collection(db, 'products');
      const productosSnapshot = await getDocs(productosCollection);
      const productosList = productosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProductos(productosList);
    } catch (error) {
      console.error('Error al obtener los productos: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProductos(productos.filter(producto => producto.id !== id));
      } catch (error) {
        console.error('Error al eliminar el producto: ', error);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-product/${id}`); // Asegúrate de tener una ruta para editar productos
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <Table aria-label="Tabla de Productos">
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>Descripción</TableColumn>
        <TableColumn>Precio</TableColumn>
        <TableColumn>Profesor</TableColumn>
        <TableColumn>Acciones</TableColumn>
      </TableHeader>
      <TableBody>
        {productos.map(producto => (
          <TableRow key={producto.id}>
            <TableCell>{producto.title}</TableCell>
            <TableCell>{producto.description}</TableCell>
            <TableCell>${producto.price}</TableCell>
            <TableCell>{producto.teacher}</TableCell>
            <TableCell>
            {/* <Button className=' ' color="primary" variant="solid" onClick={() => handleEdit(producto.id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              </Button> */}
              <Button className='w-fit ' color="primary" variant="light"  onClick={() => handleDelete(producto.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaProductos;
