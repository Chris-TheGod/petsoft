'use server';

import { signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { authSchema, petFormSchema, petIdSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { checkAuth, getPetById } from '@/lib/server-utils';
import { redirect } from 'next/navigation';

// -------------user actions--------------

export async function logIn(formData: unknown) {
  if (!(formData instanceof FormData)) {
    console.error('Invalid form data.');
    return;
  }

  await signIn('credentials', formData);

  redirect('/app/dashboard');
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get('password') as string,
    10
  );

  await prisma.user.create({
    data: {
      email: formData.get('email') as string,
      hashedPassword,
    },
  });

  await signIn('credentials', formData);
}

// -------------pet actions--------------

export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: 'Could not add pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: 'Pet not found.',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized',
    };
  }

  // db mutation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: 'Could not edit pet.',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: 'Pet not found',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized.',
    };
  }

  // db mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: 'Could not delete pet.',
    };
  }

  revalidatePath('/app', 'layout');
}
