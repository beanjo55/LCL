import { useContext } from "react";
import { ApiContext } from "./apiContext";
import type { ApiClient } from "./clientTypes";

export const useApi = (): ApiClient => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
