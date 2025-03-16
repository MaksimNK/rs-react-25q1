import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { calculatePasswordStrength, scheme } from '@utils/validation';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { PasswordStrengthMeter } from '@components/PasswordStrengthMeter';
import { saveHookFormData } from '@redux/slices/formSlice';

type FormType = {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female' | 'other';
  country: string;
  picture: FileList;
  acceptTerms: boolean;
};

type SubmitDataType = Omit<FormType, 'confirmPassword' | 'picture'> & {
  picture: string;
};

export const HookForm: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormType>({
    resolver: yupResolver(scheme),
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.list);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const watchPassword = watch('password', '');
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchPassword));
  }, [watchPassword]);

  const onSubmit = async (data: FormType) => {
    const file = data.picture?.[0];

    if (!file) {
      throw new Error('Profile picture is required.');
    }

    const pictureBase64: string = await new Promise<string>(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject('Error reading file');
          }
        };
        reader.onerror = () => reject('Error reading file');
        reader.readAsDataURL(file);
      }
    );

    const submitData: SubmitDataType = {
      ...data,
      picture: pictureBase64,
    };

    dispatch(saveHookFormData(submitData));
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
      <div className="form-group">
        <label htmlFor="hook-name">Name</label>
        <input id="hook-name" type="text" {...register('name')} />
        {errors.name && (
          <div className="error-message">{errors.name.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hook-age">Age</label>
        <input
          id="hook-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && (
          <div className="error-message">{errors.age.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hook-email">Email</label>
        <input id="hook-email" type="email" {...register('email')} />
        {errors.email && (
          <div className="error-message">{errors.email.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hook-password">Password</label>
        <input id="hook-password" type="password" {...register('password')} />
        <PasswordStrengthMeter strength={passwordStrength} />
        {errors.password && (
          <div className="error-message">{errors.password.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hook-confirmPassword">Confirm Password</label>
        <input
          id="hook-confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <div className="error-message">{errors.confirmPassword.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hook-gender">Gender</label>
        <select id="hook-gender" {...register('gender')}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <div className="error-message">{errors.gender.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hook-country">Country</label>
        <input
          id="hook-country"
          type="text"
          list="hook-countries-list"
          {...register('country')}
        />
        <datalist id="hook-countries-list">
          {countries.map((country, index) => (
            <option key={index} value={country} />
          ))}
        </datalist>
        {errors.country && (
          <div className="error-message">{errors.country.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hook-picture">
          Profile Picture (PNG/JPEG, max 2MB)
        </label>
        <input
          id="hook-picture"
          type="file"
          accept="image/png, image/jpeg"
          {...register('picture')}
        />
        {errors.picture && (
          <div className="error-message">{errors.picture.message}</div>
        )}
      </div>

      <div className="form-group checkbox-group">
        <input
          id="hook-acceptTerms"
          type="checkbox"
          {...register('acceptTerms')}
        />
        <label htmlFor="hook-acceptTerms">
          I accept the Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <div className="error-message">{errors.acceptTerms.message}</div>
        )}
      </div>

      <button type="submit" className="submit-button" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};
