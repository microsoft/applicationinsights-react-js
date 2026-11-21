// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { History } from "history";

/**
 * Settings to initialize a ReactAI instance.
 */
export interface IReactExtensionConfig {
  /**
   * React router history for enabling Application Insights PageView tracking.
   *
   * @type {History}
   * @memberof IReactAISettings
   */
  readonly history?: History;

  /**
   * Exclude history REPLACE actions from automatic PageView tracking.
   * Initial PageViews and PUSH/POP actions are still tracked.
   * Only applies when history is configured; defaults to false.
   */
  readonly excludePageViewOnReplace?: boolean;
}
