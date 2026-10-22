import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
          <div
            className="card p-4 text-center mx-auto"
            style={{ maxWidth: '480px', border: '1px solid #E5E7EB' }}
          >
            <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 bg-danger-subtle text-danger rounded-circle mx-auto">
              <AlertCircle size={36} />
            </div>
            <h2 className="fs-5 fw-semibold text-dark mb-2">Something went wrong</h2>
            <p className="text-muted small mb-4">
              An unexpected error occurred in the application. Please reload the page to continue.
            </p>
            <Button
              variant="primary"
              onClick={this.handleReload}
              icon={<RotateCcw size={16} />}
              className="mx-auto"
            >
              Reload application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
