// Helper function to check if the current path matches the link
export const isActive = (pathname: string, href: string) => {
  return pathname === href || (href !== '/' && pathname.startsWith(href));
};
