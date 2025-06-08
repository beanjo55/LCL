import React from "react";
import type { ApiClient } from "./clientTypes";
import { ApiContext } from "./apiContext";

interface ApiProviderProps {
  client: ApiClient;
  children: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({
  client,
  children,
}) => {
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
};
