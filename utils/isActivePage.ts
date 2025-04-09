export const isActivePage = (
  href: string,
  pathname: string,
): boolean => {
  // Jika href adalah '/dashboard', periksa apakah pathname juga '/dashboard'
  if (href === "/dashboard") {
    return pathname === href;
  }
  // Jika href bukan '/dashboard', periksa apakah pathname sama dengan href atau pathname berisi href
  return pathname === href || pathname.includes(href);
};
