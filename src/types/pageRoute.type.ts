// export type PageRoute<T> = {
//     pathname: string;
//     // path: <T extends Array<infer P>>(...args: T) => string;
//     path: (...args: T extends (...args: infer P) => any ? P : never[]) => string;
// };

// type PageRoute<T> = {pathname: string; path: T};

export const pathRoute = <T extends Function>(route: {pathname: string; path: T}) => {
    const url = ((...args: any[]) => `${window.location.origin}${route.path(...args)}`) as unknown as T;
    return {...route, url};
};

export const pathReplace = <T extends {}>(pathname: string, params?: T): string => {
    params ||= {} as T;
    Object.entries(params).forEach(([k, v]) => {
        pathname = pathname.replace(`[${k}]`, String(v));
    });
    return pathname;
};
