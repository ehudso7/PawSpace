import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import Button from '@/components/common/Button';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to crash reporting service
    const { errorReporter } = require('@/utils/errorReporting');
    errorReporter.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorInfo: errorInfo.toString(),
    });
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>??</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <Button
              title="Try Again"
              onPress={this.handleReset}
              style={styles.button}
            />
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => {
                // TODO: Open support/feedback screen or email
                console.log('Report error:', this.state.error);
              }}
            >
              <Text style={styles.reportText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorDetails: {
    backgroundColor: theme.colors.errorBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  reportButton: {
    padding: 12,
  },
  reportText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ErrorBoundary;