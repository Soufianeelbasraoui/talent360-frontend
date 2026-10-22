import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { loginSchema } from '../schemas/authSchemas';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/constants/enums';
import { getErrorMessage } from '@/utils/errors';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const res = await login(values);
      toastSuccess('Signed in successfully.');

      const from = location.state?.from?.pathname;
      if (from && from !== ROUTES.LOGIN && from !== ROUTES.REGISTER) {
        navigate(from, { replace: true });
      } else if (res.role === Role.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else if (res.role === Role.RECRUITER) {
        navigate(ROUTES.RECRUITER_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.CANDIDATE_DASHBOARD, { replace: true });
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Invalid credentials. Check your email and password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fs-4 fw-bold text-dark mb-1">Welcome back</h2>
        <p className="text-muted small">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email address"
          type="email"
          placeholder="name@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            isLoading={isSubmitting}
            icon={<ArrowRight size={16} />}
          >
            Continue
          </Button>
        </div>
      </form>

      <div className="text-center mt-4 pt-2 border-top">
        <span className="text-muted small">Don&apos;t have an account yet? </span>
        <Link to={ROUTES.REGISTER} className="small fw-semibold text-primary text-decoration-none">
          Create an account
        </Link>
      </div>
    </div>
  );
}
