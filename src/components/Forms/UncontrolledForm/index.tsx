import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { scheme, calculatePasswordStrength } from '@utils/validation';
import { useNavigate } from 'react-router-dom';
import { saveUncontrolledFormData } from '@redux/slices/formSlice';
import { PasswordStrengthMeter } from '@components/PasswordStrengthMeter';

interface ValidationError {
  path: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export const UncontrolledForm: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formErrors, setFormErrros] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const countries = useAppSelector((state) => state.countries.list);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const acceptTermsRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handlePasswordChange = () => {
    const password = passwordRef.current?.value;
    if (password) setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        name: nameRef.current?.value,
        age: ageRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        confirmPassword: confirmPasswordRef.current?.value,
        gender: genderRef.current?.value,
        acceptTerms: acceptTermsRef.current?.checked,
        picture: selectedFile,
        country: countryRef.current?.value,
      };
      await scheme.validate(formData, { abortEarly: false });

      if (!selectedFile) {
        throw new Error('Please upload a picture.');
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
          reader.readAsDataURL(selectedFile);
        }
      );

      const submitData = {
        ...formData,
        picture: pictureBase64,
      };

      delete submitData.confirmPassword;

      dispatch(saveUncontrolledFormData(submitData));

      navigate('/');
    } catch (error) {
      const newErrors: FormErrors = {};
      if (error instanceof Error && 'inner' in error) {
        const validationError = error as { inner: ValidationError[] };

        validationError.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      }
      setFormErrros(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="name">
          <input type="text" name="name" placeholder="Name" ref={nameRef} />
        </label>
        <div>{formErrors.name}</div>
      </div>

      <div className="form-group">
        <label htmlFor="age">
          <input type="number" name="age" placeholder="Age" ref={ageRef} />
        </label>
        <div>{formErrors.age}</div>
      </div>

      <div className="form-group">
        <label htmlFor="email">
          <input type="email" name="email" placeholder="Email" ref={emailRef} />
        </label>
        <div>{formErrors.email}</div>
      </div>

      <div className="form-group">
        <label htmlFor="password">
          <input
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
            onChange={handlePasswordChange}
          />
        </label>
        <PasswordStrengthMeter strength={passwordStrength} />
        <div>{formErrors.password}</div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
        </label>
        <div>{formErrors.confirmPassword}</div>
      </div>

      <div className="form-group">
        <label htmlFor="gender">
          <select name="gender" ref={genderRef} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <div>{formErrors.gender}</div>
      </div>

      <div className="form-group">
        <label htmlFor="countries">
          <select name="countries" ref={countryRef} required>
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
        <div>{formErrors.country}</div>
      </div>

      <div className="form-group">
        <label htmlFor="picture">
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={imageRef}
            onChange={handleFileChange}
          />
        </label>
        {selectedFile && (
          <div className="file-info">
            Selected: {selectedFile.name} (
            {Math.round(selectedFile.size / 1024)} KB)
          </div>
        )}
        <div>{formErrors.picture}</div>
      </div>

      <div className="form-group checkbox-group">
        <input id="acceptTerms" type="checkbox" ref={acceptTermsRef} />
        <label htmlFor="acceptTerms">I accept the Terms and Conditions</label>
        <div>{formErrors.acceptTerms}</div>
      </div>

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};
