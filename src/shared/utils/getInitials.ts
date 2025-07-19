export const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return '';
  if (parts.length === 1) {
    const name = parts[0].toUpperCase();
    return name.slice(0, 2);
  }

  const first = parts[0][0].toUpperCase();
  const last = parts[parts.length - 1][0].toUpperCase();

  return first + last;
};
