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
  image?: string; // Optional image
}

const NoticiasForm = () => {
  const router = useRouter();
  const { id } = router.query; // Get news ID from the URL
  const [news, setNews] = useState<News | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

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
    setLoading(true); // Start loading
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'news');
      }

      if (news) {
        // Update the news in Firestore
        await updateDoc(doc(db, 'news', id as string), {
          ...news,
          image: imageFile ? imageUrl : news.image, // Maintain the current image if no new one is uploaded
          date: new Date(news.date).toISOString(), // Save date in ISO format
        });
      }

      alert('Noticia actualizada con éxito');
      router.push('/Noticias'); // Redirect to the news page

    } catch (error) {
      console.error('Error al actualizar la noticia: ', error);
      alert('Ocurrió un error al actualizar la noticia.');
    } finally {
      setLoading(false); // End loading
    }
  };

  if (!news) return <div>Cargando...</div>;

  return (
    <BrandSidebar>
      <Card className='p-6 flex flex-col w-full md:w-full mx-auto shadow-none border'>
        <h1 className='text-3xl font-semibold tracking-tight text-gray-900 mb-4'>Editar Noticia</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='ContInput'>
            <label htmlFor="title" className='block text-gray-700 font-medium'>Título</label>
            <input
              id="title"
              type="text"
              name="title"
              value={news.title}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            />
          </div>

          <div className='ContInput'>
            <label htmlFor="content" className='block text-gray-700 font-medium'>Contenido</label>
            <textarea
              id="content"
              name="content"
              value={news.content}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            />
          </div>

          <div className='ContInput'>
            <label htmlFor="author" className='block text-gray-700 font-medium'>Autor</label>
            <input
              id="author"
              type="text"
              name="author"
              value={news.author}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            />
          </div>

          <div className='ContInput'>
            <label htmlFor="date" className='block text-gray-700 font-medium'>Fecha</label>
            <input
              id="date"
              type="date"
              name="date"
              value={news.date.split('T')[0]} // Proper format for date input
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            />
          </div>

          <div className='ContInput'>
            <label htmlFor="image" className='block text-gray-700 font-medium'>Imagen (opcional)</label>
            <input
              id="image"
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
