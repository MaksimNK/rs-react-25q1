import { FC } from 'react';
import { Header } from '@components/Header';
import { HookForm } from '@components/Forms/HookForm';

export const HookFormPage: FC = () => {
  return (
    <div>
      <Header />
      <HookForm />
    </div>
  );
};
