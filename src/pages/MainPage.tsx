import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearNewDataFlag } from '@redux/slices/formSlice';
import { UserData } from '@components/UserData/index';
import { useAppSelector } from '@hooks/reduxHooks';
import { Header } from '@components/Header';

type FormDataType = {
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  country: string;
  acceptTerms: boolean;
  picture?: string;
};

export const MainPage = () => {
  const dispatch = useDispatch();
  const { uncontrolledFormData, hookFormData, newDataSource } = useAppSelector(
    (state) => state.form
  );

  useEffect(() => {
    if (newDataSource) {
      const timer = setTimeout(() => {
        dispatch(clearNewDataFlag());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [newDataSource, dispatch]);

  return (
    <div className="main-page">
      <Header />
      <div className="data-display">
        <h2>Submitted Form Data</h2>

        <div className="tiles-container">
          {uncontrolledFormData && (
            <UserData
              title="Uncontrolled Components Form Data"
              data={uncontrolledFormData as FormDataType}
              isNew={newDataSource === 'uncontrolled'}
            />
          )}

          {hookFormData && (
            <UserData
              title="React Hook Form Data"
              data={hookFormData as FormDataType}
              isNew={newDataSource === 'hookForm'}
            />
          )}
        </div>
      </div>
    </div>
  );
};
