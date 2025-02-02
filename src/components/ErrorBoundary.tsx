import { ReactNode, Component, ErrorInfo } from 'react';

interface IPropsErrorBoundary {
  children?: ReactNode;
}

interface IStateErrorBoundary {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<
  IPropsErrorBoundary,
  IStateErrorBoundary
> {
  constructor(props: IPropsErrorBoundary) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error: error, errorInfo: errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Somthing Wrong</h1>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.toString()}</pre>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
