import { endsWith } from './router.util';

export const addRouteTransform = (route: any) => {
  return route.map((r: any) => {
    r.children = r.children
      ? r?.children.map((child: any) => {
          child = { matcher: endsWith(child.path || ''), ...child };
          delete child.path;
          return child;
        })
      : [];

    return r;
  });
};
