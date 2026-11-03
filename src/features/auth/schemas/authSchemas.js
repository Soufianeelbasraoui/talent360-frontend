import * as yup from 'yup';
import { Role } from '@/constants/enums';

// Strong password regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#^~`+=/[\]{}|;:,.<>])[A-Za-z\d@$!%*?&_\-#^~`+=/[\]{}|;:,.<>]{8,100}$/;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required'),
});

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      PASSWORD_REGEX,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .default(Role.CANDIDATE)
    .oneOf([Role.CANDIDATE], 'Public registration is only available for Candidates'),
  firstName: yup.string().trim().required('First name is required'),
  lastName: yup.string().trim().required('Last name is required'),
});

