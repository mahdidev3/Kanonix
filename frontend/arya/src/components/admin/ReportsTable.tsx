export const ReportsTable = ({ reports }: { reports: Array<{ name: string; total: number; registrations: number }> }) => {
  const handleExport = () => {
    const rows = ['name,total,registrations', ...reports.map((report) => `${report.name},${report.total},${report.registrations}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reports.csv';
    a.click();
  };

  return (
    <div className="card">
      <button className="btn btn-primary" onClick={handleExport}>خروجی CSV</button>
      <table className="table">
        <thead><tr><th>گزارش</th><th>درآمد</th><th>ثبت‌نام</th></tr></thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.name}><td>{report.name}</td><td>{report.total.toLocaleString()}</td><td>{report.registrations}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
