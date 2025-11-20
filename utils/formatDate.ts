export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("ua-UA").format(new Date(date));
}
