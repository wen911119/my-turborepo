const moduleCache:Record<string, any> = {};

export interface RemoteCjsModuleLoaderParam {
  url: string;
  dependencies?: Record<string, any>;
  fetcher?: typeof fetch;
}

export const RemoteCjsModuleLoader = ({
  url,
  dependencies = {},
  fetcher = fetch,
}: RemoteCjsModuleLoaderParam) => {
  if (!moduleCache[url]) {
    moduleCache[url] = fetcher(url)
      .then((response) => response.text())
      .then((funcString) => {
        const exports: any = {};
        const module = { exports };
        const func = new Function("require", "module", "exports", funcString);
        const require = (name: string) => dependencies[name];
        func(require, module, exports);
        return {
          default: module.exports?.default || module.exports,
          __esModule: true,
        };
      });
  }
  return moduleCache[url];
};