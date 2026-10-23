
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatAttemptDate(value) {
  if (!value) return 'Date unknown';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Date unknown';

  return dateFormatter.format(date);
}

export function formatDate(date) {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '';

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsedDate);
}
