// pages/edit/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card } from '@nextui-org/card';
import BrandSidebar from '@/layouts/default';

const CursosForm = () => {
  const router = useRouter();
  const { id } = router.query; // Get course ID from the URL
  const [course, setCourse] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        const docRef = doc(db, 'courses', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse(docSnap.data());
        } else {
          console.log('No existe el curso');
        }
      };
      fetchCourse();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'video') {
        setVideoFile(files[0]);
      } else if (name === 'image') {
        setImageFile(files[0]);
      }
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updates: any = { ...course };

      if (videoFile) {
        updates.video = await uploadFile(videoFile, 'videos');
      }
      if (imageFile) {
        updates.image = await uploadFile(imageFile, 'images');
      }

      await updateDoc(doc(db, 'courses', id as string), updates);
      alert('Curso actualizado con éxito');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al actualizar el curso: ', error);
    }
  };

  if (!course) return <div>Cargando...</div>;

  return (
    <BrandSidebar>
      <Card className='p-4 flex flex-col w-full shadow-none border'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>Editar Curso</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='ContInput'>
            <label htmlFor="title">Título</label>
            <input type="text" id="title" name="title" value={course.title} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="description">Descripción</label>
            <textarea id="description" name="description" value={course.description} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="level">Nivel</label>
            <Select id="level" name="level" value={course.level} onChange={handleChange} required>
              <SelectItem key="Básico" value="Básico">Básico</SelectItem>
              <SelectItem key="Intermedio" value="Intermedio">Intermedio</SelectItem>
              <SelectItem key="Avanzado" value="Avanzado">Avanzado</SelectItem>
            </Select>
          </div>
          <div className='ContInput'>
            <label htmlFor="language">Idioma</label>
            <input type="text" id="language" name="language" value={course.language} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="duration">Duración (minutos)</label>
            <input type="number" id="duration" name="duration" value={course.duration} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="purchased">Cantidad Comprados</label>
            <input type="number" id="purchased" name="purchased" value={course.purchased} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="teacher">Profesor</label>
            <input type="text" id="teacher" name="teacher" value={course.teacher} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="teacherDescription">Descripción del Profesor</label>
            <textarea id="teacherDescription" name="teacherDescription" value={course.teacherDescription} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="price">Precio</label>
            <input type="number" id="price" name="price" value={course.price} onChange={handleChange} required />
          </div>
          <div className='ContInput'>
            <label htmlFor="video">Video (opcional)</label>
            <input type="file" id="video" name="video" accept="video/*" onChange={handleFileChange} />
          </div>
          <div className='ContInput'>
            <label htmlFor="image">Imagen (opcional)</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
          </div>
          <Button type="submit" color='primary' variant='shadow' className='rounded w-full mt-5'>Actualizar Curso</Button>
        </form>
      </Card>
    </BrandSidebar>
  );
};

export default CursosForm;
