import { createContext } from "react";
import type { ApiClient } from "./clientTypes";

export const ApiContext = createContext<ApiClient | null>(null);
