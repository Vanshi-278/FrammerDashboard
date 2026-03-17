export function exportToCSV(
  data: any[],
  columns: { key: string; label: string }[],
  filename: string = 'export.csv'
) {
  const headers = columns.map((col) => col.label);
  const keys = columns.map((col) => col.key);

  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      keys.map((key) => `"${row[key] || ''}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
