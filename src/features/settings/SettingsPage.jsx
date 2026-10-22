import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/api/userService';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { getErrorMessage } from '@/utils/errors';
import { Lock, Save } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
      } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitPassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toastError('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await userService.updateMe({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toastSuccess('Your password has been changed successfully.');
      reset();
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to update password. Verify your current password.'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div className="mb-4">
        <h1 className="fs-4 fw-bold text-dark mb-1">Account Settings</h1>
        <p className="text-muted small mb-0">
          Manage your account credentials and security preferences.
        </p>
      </div>

      {/* Account Info */}
      <Card header={<div className="fw-semibold">Account Overview</div>} className="mb-4">
        <div className="row g-3">
          <div className="col-12">
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Contact system administrators to change your account email."
            />
          </div>
          <div className="col-12">
            <Input
              label="Assigned Role"
              value={user?.role || ''}
              disabled
              helperText="Your role defines your access permissions across the platform."
            />
          </div>
        </div>
      </Card>

      {/* Change Password Form */}
      <Card header={<div className="fw-semibold">Change Password</div>} className="mb-4">
        <form onSubmit={handleSubmit(onSubmitPassword)}>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            leftIcon={<Lock size={15} />}
            required
            {...register('currentPassword', { required: 'Current password is required' })}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            leftIcon={<Lock size={15} />}
            required
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            leftIcon={<Lock size={15} />}
            required
            {...register('confirmPassword', { required: 'Please confirm your new password' })}
          />

          <div className="d-flex justify-content-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isUpdatingPassword}
              icon={<Save size={14} />}
            >
              Update password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
