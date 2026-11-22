// Shows the list of past actions (the server already sends newest first).
const labels = { increase: "Increased", decrease: "Decreased", reset: "Reset" };
const colors = {
  increase: "bg-teal-50 text-teal-800",
  decrease: "bg-amber-50 text-amber-800",
  reset: "bg-slate-100 text-slate-700",
};

export default function HistoryList({ history }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">History</h2>

      {history.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-500">
          No actions yet. Press Increase to start.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {history.map((item) => (
            <li key={item._id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${colors[item.action]}`}>
                  {labels[item.action]}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="text-lg font-semibold tabular-nums text-slate-800">{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
