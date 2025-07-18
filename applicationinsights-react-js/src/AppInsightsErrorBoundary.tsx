// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from "react";
import { SeverityLevel } from "@microsoft/applicationinsights-common";
import ReactPlugin from "./ReactPlugin";

export interface IAppInsightsErrorBoundaryProps {
    appInsights: ReactPlugin
    onError: React.ComponentType<any>
    children: React.ReactElement
}

export interface IAppInsightsErrorBoundaryState {
    hasError: boolean
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export default class AppInsightsErrorBoundary extends React.Component<IAppInsightsErrorBoundaryProps, IAppInsightsErrorBoundaryState> {
    state: IAppInsightsErrorBoundaryState = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ hasError: true, error, errorInfo });
        this.props.appInsights.trackException({
            error: error,
            exception: error,
            severityLevel: SeverityLevel.Error,
            properties: errorInfo
        });
    }

    render() {
        const { hasError, error, errorInfo } = this.state;
 
        const { onError, children } = this.props;
        
        if (hasError) {
            return React.createElement(onError, {error, errorInfo});
        }

        return children;
    }
}
