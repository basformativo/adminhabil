// components/Cursos.tsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
import { useRouter } from 'next/router';
import { FaUpload } from 'react-icons/fa';

interface Chapter {
  title: string;
  description: string;
  duration: number;
  video: string;
}

interface Course {
  video: string;
  image: string;
  title: string;
  description: string;
  level: string;
  language: string;
  duration: number;
  purchased: number;
  teacher: string;
  teacherDescription: string;
  price: number;
  chapters: Chapter[];
}

const CursosForm = () => {
  const router = useRouter();
  const [course, setCourse] = useState<Course>({
    video: '',
    image: '',
    title: '',
    description: '',
    level: '',
    language: '',
    duration: 0,
    purchased: 0,
    teacher: '',
    teacherDescription: '',
    price: 0,
    chapters: [],
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [chapterDuration, setChapterDuration] = useState<number>(0);
  const [chapterVideoFile, setChapterVideoFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');

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
      } else if (name === 'chapterVideo') {
        setChapterVideoFile(files[0]);
      }
    }
  };

  const addChapter = async () => {
    if (!chapterTitle || !chapterDescription || chapterDuration <= 0 || !chapterVideoFile) {
      alert("Por favor completa todos los campos del capítulo.");
      return;
    }

    try {
      const videoUrl = await uploadFile(chapterVideoFile, 'chapter-videos');
      const newChapter: Chapter = { title: chapterTitle, description: chapterDescription, duration: chapterDuration, video: videoUrl };
      setCourse((prevCourse) => ({
        ...prevCourse,
        chapters: [...prevCourse.chapters, newChapter],
      }));
      // Reiniciar campos de capítulo
      setChapterTitle('');
      setChapterDescription('');
      setChapterDuration(0);
      setChapterVideoFile(null);
    } catch (error) {
      console.error('Error al agregar capítulo:', error);
      alert('Error al agregar capítulo. Inténtalo de nuevo.');
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          setUploadingFileName(file.name);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const videoUrl = videoFile ? await uploadFile(videoFile, 'videos') : '';
      const imageUrl = imageFile ? await uploadFile(imageFile, 'images') : '';

      await addDoc(collection(db, 'courses'), {
        ...course,
        video: videoUrl,
        image: imageUrl,
      });

      alert('Curso creado con éxito');
      router.push('/Cursos');

      // Reiniciar formulario
      setCourse({
        video: '',
        image: '',
        title: '',
        description: '',
        level: '',
        language: '',
        duration: 0,
        purchased: 0,
        teacher: '',
        teacherDescription: '',
        price: 0,
        chapters: [],
      });
      setVideoFile(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error al crear el curso: ', error);
    }
  };

  return (
    <Card className='p-4 flex flex-col w-full shadow-none border'>
      <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>Crear/Editar Curso</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Campos del curso */}
        <div className='ContInput'>
          <label htmlFor="title">Título</label>
          <input type="text" name="title" id="title" value={course.title} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="description">Descripción</label>
          <textarea name="description" id="description" value={course.description} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="level">Nivel</label>
          <Select label='Nivel' name="level" value={course.level} onChange={handleChange} required>
            <SelectItem key="Básico" value="Básico">Básico</SelectItem>
            <SelectItem key="Intermedio" value="Intermedio">Intermedio</SelectItem>
            <SelectItem key="Avanzado" value="Avanzado">Avanzado</SelectItem>
          </Select>
        </div>
        <div className='ContInput'>
          <label htmlFor="language">Idioma</label>
          <input type="text" name="language" id="language" value={course.language} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="duration">Duración (minutos)</label>
          <input type="number" name="duration" id="duration" value={course.duration} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="purchased">Cantidad Comprados</label>
          <input type="number" name="purchased" id="purchased" value={course.purchased} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="teacher">Profesor</label>
          <input type="text" name="teacher" id="teacher" value={course.teacher} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="teacherDescription">Descripción del Profesor</label>
          <textarea name="teacherDescription" id="teacherDescription" value={course.teacherDescription} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="price">Precio</label>
          <input type="number" name="price" id="price" value={course.price} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label htmlFor="video">Video Principal</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">MP4, WebM, Ogg (MAX. 100MB)</p>
              </div>
              <input type="file" name="video" id="video" accept="video/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>
        <div className='ContInput'>
          <label htmlFor="image">Imagen</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">Imagen (MAX. 2MB)</p>
              </div>
              <input type="file" name="image" id="image" accept="image/*" onChange={handleFileChange} className="hidden" required />
            </label>
          </div>
        </div>

        {/* Sección para agregar capítulos */}
        <div className="space-y-2">
          <label htmlFor="chapterTitle" className="block text-sm font-medium text-gray-700">
            Título del Capítulo
          </label>
          <input
            id="chapterTitle"
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
          
          <label htmlFor="chapterDescription" className="block text-sm font-medium text-gray-700">
            Descripción del Capítulo
          </label>
          <textarea
            id="chapterDescription"
            value={chapterDescription}
            onChange={(e) => setChapterDescription(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
          
          <label htmlFor="chapterDuration" className="block text-sm font-medium text-gray-700">
            Duración del Capítulo (minutos)
          </label>
          <input
            id="chapterDuration"
            type="number"
            value={chapterDuration}
            onChange={(e) => setChapterDuration(Number(e.target.value))}
            className="border rounded-md p-2 w-full"
            required
          />
          
          <div className="space-y-2">
            <label htmlFor="chapterVideo" className="block text-sm font-medium text-gray-700">
              Video del Capítulo
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="chapterVideo"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500">MP4, WebM, Ogg (MAX. 100MB)</p>
                </div>
                <input
                  id="chapterVideo"
                  type="file"
                  name="chapterVideo"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            <Button type="button" color='primary' onClick={addChapter} className='rounded w-full mt-2'>
              Agregar Capítulo
            </Button>
          </div>

          {/* Progreso de carga */}
          {uploadingFileName && (
            <div className="mt-4">
              <p>Subiendo: {uploadingFileName}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p>{Math.round(uploadProgress)}% completado</p>
            </div>
          )}
        </div>

        {/* Lista de capítulos */}
        <div>
          <h2 className='text-xl font-bold mt-4'>Capítulos Agregados</h2>
          <ul>
            {course.chapters.map((chapter, index) => (
              <li key={index} className='mt-2'>
                <h3 className='font-semibold'>{chapter.title}</h3>
                <p>{chapter.description}</p>
                <p>Duración: {chapter.duration} minutos</p>
                <a href={chapter.video} target="_blank" rel="noopener noreferrer">Ver Video</a>
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" color='primary' variant='shadow' className='rounded w-full mt-5'>
          Guardar Curso
        </Button>
      </form>
    </Card>
  );
};

export default CursosForm;
