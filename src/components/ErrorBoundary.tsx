import { Component } from "react";

export class ErrorBoundary extends Component {
  state: { error: Error | null } = { error: null };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // tslint:disable-next-line
    console.log(error, errorInfo);

    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return null;
    } else {
      return this.props.children;
    }
  }
}
