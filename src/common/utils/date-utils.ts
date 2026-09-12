export const getFormattedDate = (is12Hour: boolean = false): string => {
  const date = new Date();
  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: is12Hour,
  });

  return `${datePart} ${timePart}`;
};
