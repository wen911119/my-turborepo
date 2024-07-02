import React, { type FC, Suspense, type ReactNode, lazy, useRef, Fragment } from "react";
import {
  RemoteCjsModuleLoader as loader,
  type RemoteCjsModuleLoaderParam,
} from "@microfe.top/remote-cjs-module-loader";

export interface RemoteComponentProps extends RemoteCjsModuleLoaderParam {
  loadingComponent?: ReactNode;
  [key: string]: any;
}

export const DefaultLoadingComponent:FC = () => <Fragment>loading...</Fragment>;

export const defaultDependencies = {
  react: React,
};

export const RemoteComponent: FC<RemoteComponentProps> = ({
  url,
  dependencies = defaultDependencies,
  fetcher,
  loadingComponent = <DefaultLoadingComponent />,
  ...otherProps
}) => {
  const LazyComponent = useRef(
    lazy(() => loader({ url, dependencies, fetcher }))
  );
  return (
    <Suspense fallback={loadingComponent}>
      <LazyComponent.current {...otherProps} />
    </Suspense>
  );
};