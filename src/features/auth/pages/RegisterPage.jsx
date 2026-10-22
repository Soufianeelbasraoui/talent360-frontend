import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { registerSchema } from '../schemas/authSchemas';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/constants/enums';
import { getErrorMessage } from '@/utils/errors';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerAuth } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      role: Role.CANDIDATE,
      firstName: '',
      lastName: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const res = await registerAuth(values);
      toastSuccess('Account created successfully.');
      if (res.role === Role.RECRUITER) {
        navigate(ROUTES.RECRUITER_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.CANDIDATE_DASHBOARD, { replace: true });
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Could not create your account. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fs-4 fw-bold text-dark mb-1">Create your account</h2>
        <p className="text-muted small">Select your profile type and fill in your details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Role Selector */}
        <div className="mb-3 text-start">
          <span className="form-label d-block">I am a</span>
          <div className="d-grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button
              type="button"
              className={clsx(
                'btn text-start p-3 d-flex flex-column gap-1 border',
                selectedRole === Role.CANDIDATE
                  ? 'border-primary bg-primary bg-opacity-10 text-primary'
                  : 'btn-secondary text-muted'
              )}
              onClick={() => setValue('role', Role.CANDIDATE, { shouldValidate: true })}
            >
              <div className="d-flex align-items-center gap-2 fw-semibold">
                <User size={16} />
                <span>Candidate</span>
              </div>
              <span className="small text-muted" style={{ fontSize: '0.6875rem' }}>
                Looking for opportunities
              </span>
            </button>

            <button
              type="button"
              className={clsx(
                'btn text-start p-3 d-flex flex-column gap-1 border',
                selectedRole === Role.RECRUITER
                  ? 'border-primary bg-primary bg-opacity-10 text-primary'
                  : 'btn-secondary text-muted'
              )}
              onClick={() => setValue('role', Role.RECRUITER, { shouldValidate: true })}
            >
              <div className="d-flex align-items-center gap-2 fw-semibold">
                <Briefcase size={16} />
                <span>Recruiter</span>
              </div>
              <span className="small text-muted" style={{ fontSize: '0.6875rem' }}>
                Hiring talent &amp; posting jobs
              </span>
            </button>
          </div>
          {errors.role && (
            <div className="invalid-feedback d-block mt-1">{errors.role.message}</div>
          )}
        </div>

        <div className="row g-2">
          <div className="col-6">
            <Input
              label="First name"
              placeholder="Sara"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Last name"
              placeholder="El Mansouri"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

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
          placeholder="At least 6 characters"
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
        <span className="text-muted small">Already have an account? </span>
        <Link to={ROUTES.LOGIN} className="small fw-semibold text-primary text-decoration-none">
          Sign in
        </Link>
      </div>
    </div>
  );
}
