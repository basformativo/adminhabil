// components/ListaCursos.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CustomCard from './Card/Cursos';

interface Course {
  id: string;
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
}

const ListaCursos = () => {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCursos = async () => {
    try {
      const cursosCollection = collection(db, 'courses');
      const cursosSnapshot = await getDocs(cursosCollection);
      const cursosList = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCursos(cursosList);
    } catch (error) {
      console.error('Error al obtener los cursos: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  if (loading) {
    return <div>Cargando cursos...</div>;
  }

  return (
    <div className='flex flex-wrap gap-4'>
      {cursos.map(curso => (
        <CustomCard
          key={curso.id}
          imageSrc={curso.image}
          title={curso.title}
          description={curso.description}
          additionalText={`Nivel: ${curso.level}`}
          percentage={''} // Ajusta según tus necesidades
          userdata={curso.purchased.toString()}
          mg={'520'} // Ajusta según tus necesidades
          price={`$${curso.price}`}
          nivel={curso.level}
          Estudiantes={curso.purchased.toString()}
          audio={curso.language} // Ajusta según tus necesidades
        />
      ))}
    </div>
  );
};

export default ListaCursos;
