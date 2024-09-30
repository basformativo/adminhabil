import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
import { useRouter } from 'next/router';
import { FaUpload } from 'react-icons/fa';

interface Product {
  document: string;
  image: string;
  title: string;
  description: string;
  level: string;
  language: string;
  teacher: string;
  teacherDescription: string;
  price: number;
}

const ProductoExtend = () => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    document: '',
    image: '',
    title: '',
    description: '',
    level: '',
    language: '',
    teacher: '',
    teacherDescription: '',
    price: 0,
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'document') {
        setDocumentFile(files[0]);
      } else if (name === 'image') {
        setImageFile(files[0]);
      }
    }
  };

  const uploadFile = async (file: File, folder: string) => {
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
      const documentUrl = documentFile ? await uploadFile(documentFile, 'documents') : '';
      const imageUrl = imageFile ? await uploadFile(imageFile, 'images') : '';

      await addDoc(collection(db, 'products'), {
        ...product,
        document: documentUrl,
        image: imageUrl,
      });
      
      alert('Producto creado con éxito');
      router.push('/Productos');

      // Reiniciar formulario
      setProduct({
        document: '',
        image: '',
        title: '',
        description: '',
        level: '',
        language: '',
        teacher: '',
        teacherDescription: '',
        price: 0,
      });
      setDocumentFile(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error al crear el producto: ', error);
      alert('Error al crear el producto. Inténtalo de nuevo.');
    }
  };

  return (
    <Card className='p-4 flex flex-col w-full shadow-none border'>
      <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>Crear/Editar Producto</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Campos del producto */}
        <div className='ContInput'>
          <label>Título</label>
          <input type="text" name="title" value={product.title} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label>Descripción</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label>Nivel</label>
          <Select label='Nivel' name="level" value={product.level} onChange={handleChange} required>
            <SelectItem key="Básico" value="Básico">Básico</SelectItem>
            <SelectItem key="Intermedio" value="Intermedio">Intermedio</SelectItem>
            <SelectItem key="Avanzado" value="Avanzado">Avanzado</SelectItem>
          </Select>
        </div>
        <div className='ContInput'>
          <label>Idioma</label>
          <input type="text" name="language" value={product.language} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label>Profesor</label>
          <input type="text" name="teacher" value={product.teacher} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label>Descripción del Profesor</label>
          <textarea name="teacherDescription" value={product.teacherDescription} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label>Precio</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="border rounded-md p-2 w-full" required />
        </div>
        <div className='ContInput'>
          <label>Documento/Archivo Principal</label>
          <div className="flex items-center justify-center w-full">
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, MP4, JPG, PNG (MAX. 100MB)</p>
              </div>
              <input
                type="file"
                name="document"
                accept=".pdf,.doc,.docx,image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className='ContInput'>
          <label>Imagen</label>
          <div className="flex items-center justify-center w-full">
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">JPG, PNG (MAX. 5MB)</p>
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <Button type="submit" color='primary' variant='shadow' className='rounded w-full mt-5'>
          Guardar Producto
        </Button>
      </form>
    </Card>
  );
};

export default ProductoExtend;
