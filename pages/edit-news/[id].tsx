import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import BrandSidebar from '@/layouts/default';

interface News {
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string; // La imagen puede ser opcional
}

const NoticiasForm = () => {
  const router = useRouter();
  const { id } = router.query; // Obtener ID de la noticia desde la URL
  const [news, setNews] = useState<News | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar el loading

  useEffect(() => {
    const fetchNews = async () => {
      if (id) {
        const docRef = doc(db, 'news', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNews(docSnap.data() as News);
        } else {
          console.log('No existe la noticia');
        }
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (news) {
      setNews({ ...news, [name]: value });
    }
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

      if (news) {
        // Actualizar la noticia en Firestore
        await updateDoc(doc(db, 'news', id as string), {
          ...news,
          image: imageFile ? imageUrl : news.image, // Mantiene la imagen actual si no se sube una nueva
          date: new Date(news.date).toISOString(), // Guardar la fecha en formato ISO
        });
      }

      alert('Noticia actualizada con éxito');
      router.push('/Noticias'); // Redirige a la página de noticias

    } catch (error) {
      console.error('Error al actualizar la noticia: ', error);
      alert('Ocurrió un error al actualizar la noticia.');
    } finally {
      setLoading(false); // Finaliza loading
    }
  };

  if (!news) return <div>Cargando...</div>;

  return (
    <BrandSidebar>
    <Card className='p-6 flex flex-col w-full md:w-full mx-auto shadow-none border'>
      <h1 className='text-3xl font-semibold tracking-tight text-gray-900 mb-4'>Editar Noticia</h1>
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
            value={news.date.split('T')[0]} // Formato adecuado para el input tipo date
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>

        <div className='ContInput'>
          <label className='block text-gray-700 font-medium'>Imagen (opcional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>

        <Button type="submit" color='primary' isDisabled={loading} className='rounded w-full mt-5'>
          {loading ? 'Guardando...' : 'Actualizar Noticia'}
        </Button>
      </form>
    </Card>
    </BrandSidebar>
  );
};

export default NoticiasForm;
