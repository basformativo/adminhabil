'use client';
import { Button } from "@nextui-org/button";
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { FaGoogle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { auth } from "@/lib/firebase";

export const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<any>(null); // Mantiene el estado del usuario
    const router = useRouter();
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });
      return () => unsubscribe();
    }, []);
  
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };
  
    const handleGoogleLogin = async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        router.push('/dashboard');
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push('/'); // Redirigir a la página principal después de cerrar sesión
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };
  return (
    <div>
                <Card className='max-w-md w-96 shadow-lg border border-gray-200'>
                  <CardHeader className="flex flex-col pt-8 ">
                    <h1 className="text-3xl font-extrabold text-gray-800">Iniciar sesión</h1>
                    <p className="text-sm text-gray-500">Elige tu método de inicio de sesión preferido</p>
                  </CardHeader>
                  <CardBody className="py-6 px-8 bg-white">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className='w-full flex justify-center'>
                        <Button
                          type="button"
                          onClick={handleGoogleLogin}
                          className="flex gap-2 items-center rounded shadow-sm"
                        >
                          <FaGoogle />
                          Iniciar sesión con Google
                        </Button>
                      </div>
                      <div className='flex items-center justify-center'>
                        <Divider className='w-1/4' />
                        <span className="mx-4 w-2/4 text-center text-gray-500">O continuar con</span>
                        <Divider className='w-1/4' />
                      </div>
                      <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-gray-800'>Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='rounded h-10 border shadow-sm p-2 text-gray-500'
                          />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <label className='text-sm font-medium text-gray-800'>Contraseña</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='rounded h-10 border shadow-sm'
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full mt-2 flex gap-2 items-center justify-center hover:gap-3"
                          variant="shadow"
                          color="primary"
                        >
                          Iniciar sesión
                          <IoIosArrowForward />
                        </Button>
                      </div>
                    </form>
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                  </CardBody>
                </Card>
    </div>
  )
}
