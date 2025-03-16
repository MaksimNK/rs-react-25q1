import * as yup from 'yup';

export const scheme = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .test(
      'first-letter-uppercase',
      'Name must start with an uppercase letter',
      (value) =>
        value ? value.charAt(0) === value.charAt(0).toUpperCase() : false
    ),
  email: yup.string().email().required('Email is required'),
  age: yup
    .number()
    .positive('Age must be positive')
    .integer('Age must be integer')
    .required('Age is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[^\w]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .required('Gender is required'),
  acceptTerms: yup
    .boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),
  picture: yup
    .mixed<FileList>()
    .required('File is required')
    .test('fileSingle', 'Only one file allowed', (value) => {
      if (!value) return true;
      if (!(value instanceof FileList)) return true;
      return value.length === 1;
    })
    .test('fileSize', 'The file is too large (picture size < 1Mb)', (value) => {
      if (!value) return true;
      if (!(value instanceof FileList)) return true;
      return value[0].size <= 1000000;
    })
    .test(
      'fileType',
      'Only the following formats are accepted: .jpg, .png',
      (value) => {
        if (!value) return true;
        if (!(value instanceof FileList) || value.length !== 1 || !value[0])
          return true;
        return value[0].type === 'image/jpeg' || value[0].type === 'image/png';
      }
    ),
  country: yup.string().required('Country is required'),
});

export const calculatePasswordStrength = (password: string) => {
  if (!password) return 0;
  let strength = 0;
  if (password.match(/[0-9]+/)) strength += 1;
  if (password.match(/[a-z]+/)) strength += 1;
  if (password.match(/[A-Z]+/)) strength += 1;
  if (password.match(/[^\w]+/)) strength += 1;
  return strength;
};
