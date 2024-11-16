'use client';

import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { logOut } from '@/actions/actions';

export default function SignOutBtn() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={async () =>
        startTransition(async () => {
          await logOut();
        })
      }
    >
      Sign out
    </Button>
  );
}
