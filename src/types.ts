import { LazyExoticComponent } from "react";

export interface RouteConfig {
    path: string;
    element: LazyExoticComponent<any>;
    layout?: LazyExoticComponent<any>;
}

export interface AuthPageProps {
    isLogin: boolean;
    toggleAuth: () => void;
}
  