import React from 'react';
import { sanitizeLog } from '../services/securityConfig';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log sanitizado do erro
    console.error('ErrorBoundary caught an error:', {
      message: sanitizeLog(error.message),
      stack: sanitizeLog(error.stack?.substring(0, 500)),
      componentStack: sanitizeLog(errorInfo.componentStack?.substring(0, 500))
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo deu errado</h2>
          <p>Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
          <button onClick={() => window.location.reload()}>
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;