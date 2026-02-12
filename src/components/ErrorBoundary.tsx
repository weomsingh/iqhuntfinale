import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                    <p className="text-zinc-400 mb-8 max-w-md">
                        The application encountered a critical error. Please refresh the page or contact support.
                    </p>
                    <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 text-left overflow-auto max-w-2xl w-full max-h-64">
                        <p className="font-mono text-red-400 text-sm whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors"
                    >
                        Reload Application
                    </button>
                    <a href="/" className="mt-4 text-zinc-500 hover:text-white underline">Go to Homepage</a>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
