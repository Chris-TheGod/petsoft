'use server';

import prisma from '@/lib/db';
import { Pet } from '@/lib/types';

export async function addPet(formData) {
  await prisma.pet.create({
    data: {
      name: formData.get('name'),
      ownerName: formData.get('ownerName'),
      age: parseInt(formData.get('age')),
      imageUrl: formData.get('imageUrl'),
      notes: formData.get('notes'),
    },
  });
}
