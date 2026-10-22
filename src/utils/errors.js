
export function getErrorMessage(error, defaultMessage = 'An unexpected error occurred. Please try again.') {
  if (!error) return defaultMessage;

  if (error.response) {
    const data = error.response.data;
    const status = error.response.status;

    if (data && typeof data === 'object') {
      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message;
      }
      if (data.errors && typeof data.errors === 'object') {
        const firstField = Object.keys(data.errors)[0];
        if (firstField && data.errors[firstField]) {
          return `${firstField}: ${data.errors[firstField]}`;
        }
      }
    }

    switch (status) {
      case 400:
        return 'Please check your submitted information and try again.';
      case 401:
        return 'Your session has expired. Please sign in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource could not be found.';
      case 409:
        return 'This record already exists or conflicts with an existing entry.';
      case 500:
        return 'Our server encountered an issue. Please try again shortly.';
      default:
        return `Server returned error (${status}). Please try again.`;
    }
  }

  if (error.request) {
    return 'Could not connect to the server. Check your connection and try again.';
  }

  if (typeof error.message === 'string' && error.message.trim().length > 0) {
    return error.message;
  }

  return defaultMessage;
}
