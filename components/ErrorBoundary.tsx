
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
    // You can also log the error to an error reporting service here
    // Example: logErrorToMyService(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };
  
  private handleGoHome = () => {
    // Basic navigation to home. If using a router, use its navigation method.
    window.location.href = '/';
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong.</h1>
            <p className="text-slate-600 mb-6">
              We're sorry for the inconvenience. An unexpected error occurred.
              Please try refreshing the page or returning to the homepage.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-slate-100 text-left rounded text-xs text-slate-700 overflow-auto max-h-48">
                <summary className="font-medium cursor-pointer">Error Details (Development Mode)</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="flex space-x-4 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-md transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
