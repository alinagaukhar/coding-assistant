import styled from '@emotion/styled';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;

    const reload = () => {
      window.location.replace(window.location.origin);
    };

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <StyledErrorPage>
          Something went wrong. Please, return to <StyledCTA onClick={reload}>homepage</StyledCTA>
        </StyledErrorPage>
      );
    }
    const {
      props: { children },
    } = this;
    return children;
  }
}

const StyledErrorPage = styled.div`
  padding: 2rem;
  font-size: 30px;
`;

const StyledCTA = styled.div`
  display: inline;
  font-size: inherit;
  color: #48aff0;
  cursor: pointer;
`;

export default ErrorBoundary;
