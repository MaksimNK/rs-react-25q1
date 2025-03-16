import { FC } from 'react';
import { UncontrolledForm } from '@components/Forms/UncontrolledForm';
import { Header } from '@components/Header';

export const UncontrolledFormPage: FC = () => {
  return (
    <div>
      <Header />
      <UncontrolledForm />
    </div>
  );
};
