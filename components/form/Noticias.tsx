import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/router';

interface News {
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string; // La imagen puede ser opcional
}

const NoticiasForm = () => {
  const router = useRouter();
  const [news, setNews] = useState<News>({
    title: '',
    content: '',
    author: '',
    date: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar el loading

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNews({ ...news, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Inicia loading
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'news');
      }

      // Guardar la noticia en Firestore con la URL de la imagen (si existe)
      await addDoc(collection(db, 'news'), {
        ...news,
        image: imageUrl,
        date: new Date(news.date).toISOString(), // Guardar la fecha en formato ISO
      });

      alert('Noticia creada con éxito');
      router.push('/Noticias'); // Redirige a la página de blog

      // Reiniciar el formulario
      setNews({
        title: '',
        content: '',
        author: '',
        date: '',
        image: '',
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error al crear la noticia: ', error);
      alert('Ocurrió un error al crear la noticia.');
    } finally {
      setLoading(false); // Finaliza loading
    }
  };

  return (
    <Card className='p-6 flex flex-col w-full md:w-full mx-auto shadow-none border'>
      <h1 className='text-3xl font-semibold tracking-tight text-gray-900 mb-4'>Crear/Editar Noticia</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='ContInput'>
          <label className='block text-gray-700 font-medium'>Título</label>
          <input
            type="text"
            name="title"
            value={news.title}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>

        <div className='ContInput'>
          <label className='block text-gray-700 font-medium'>Contenido</label>
          <textarea
            name="content"
            value={news.content}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>

        <div className='ContInput'>
          <label className='block text-gray-700 font-medium'>Autor</label>
          <input
            type="text"
            name="author"
            value={news.author}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>

        <div className='ContInput'>
          <label className='block text-gray-700 font-medium'>Fecha</label>
          <input
            type="date"
            name="date"
            value={news.date}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>

        <div className='ContInput'>
          <label className='block text-gray-700 font-medium'>Imagen</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>

        <Button type="submit" color='primary' isDisabled={loading} className='rounded w-full mt-5'>
          {loading ? 'Guardando...' : 'Guardar Noticia'}
        </Button>
      </form>
    </Card>
  );
};

export default NoticiasForm;

