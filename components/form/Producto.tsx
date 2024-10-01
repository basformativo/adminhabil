import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/router';

interface Product {
  image: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductoForm: React.FC = () => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    image: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle file change and validate it's an image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      } else {
        alert('Por favor selecciona un archivo de imagen válido.');
        setImageFile(null);
      }
    }
  };

  // Upload file to Firebase Storage
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const storage = getStorage();
    const uniqueName = `${folder}/${Date.now()}_${file.name}`; // Generate a unique name for the file
    const storageRef = ref(storage, uniqueName);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check if the user is authenticated
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('Debes estar autenticado para realizar esta acción.');
      setIsLoading(false);
      return;
    }

    try {
      const imageUrl = imageFile ? await uploadFile(imageFile, 'products') : '';
      
      // Save the product with the image URL
      await addDoc(collection(db, 'products'), {
        ...product,
        image: imageUrl,
        userId: user.uid,  // Associate the product with the authenticated user
      });
      
      alert('Producto creado con éxito');
      
      // Redirect to dashboard
      router.push('/Productos');
      
      // Reset the form
      setProduct({
        image: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
      });
      setImageFile(null);
    } catch (error) {
      alert('Error al crear el producto. Inténtalo de nuevo.');
      console.error('Error al crear el producto: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='p-4 flex flex-col w-full shadow-none border'>
      <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>Crear/Editar Producto</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='ContInput'>
          <label htmlFor="name">Nombre</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            required 
            className='border border-gray-300 rounded-md p-2' 
          />
        </div>
        <div className='ContInput'>
          <label htmlFor="description">Descripción</label>
          <textarea 
            id="description" 
            name="description" 
            value={product.description} 
            onChange={handleChange} 
            required 
            className='border border-gray-300 rounded-md p-2' 
          />
        </div>
        <div className='ContInput'>
          <label htmlFor="price">Precio</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            value={product.price} 
            onChange={handleChange} 
            required 
            className='border border-gray-300 rounded-md p-2' 
          />
        </div>
        <div className='ContInput'>
          <label htmlFor="stock">Stock</label>
          <input 
            type="number" 
            id="stock" 
            name="stock" 
            value={product.stock} 
            onChange={handleChange} 
            required 
            className='border border-gray-300 rounded-md p-2' 
          />
        </div>
        <div className='ContInput'>
          <label htmlFor="image">Imagen</label>
          <input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*" 
            onChange={handleFileChange} 
            required 
            className='border border-gray-300 rounded-md p-2' 
          />
        </div>
        <Button 
          type="submit" 
          color='primary' 
          variant='shadow' 
          className='rounded w-full mt-5' 
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </form>
    </Card>
  );
};  

export default ProductoForm;
