import 'server-only';

import { redirect } from 'next/navigation';
import { auth } from './auth';
import { Pet } from '@prisma/client';
import prisma from './db';

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return session;
}

export async function getPetById(petId: Pet['id']) {
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
  });

  return pet;
}
