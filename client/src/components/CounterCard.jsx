// Shows the big number and the three buttons.
// "busy" disables the buttons while a request is running.
export default function CounterCard({ value, busy, onAction }) {
  const base =
    "rounded-lg px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm text-slate-500">Current value</p>
      <p className="my-4 text-7xl font-bold tabular-nums text-teal-700 sm:text-8xl">{value}</p>

      <div className="grid grid-cols-3 gap-3">
        <button
          disabled={busy}
          onClick={() => onAction("decrease")}
          className={`${base} border border-slate-300 text-slate-700 hover:bg-slate-100`}
        >
          Decrease
        </button>
        <button
          disabled={busy}
          onClick={() => onAction("reset")}
          className={`${base} border border-slate-300 text-slate-700 hover:bg-slate-100`}
        >
          Reset
        </button>
        <button
          disabled={busy}
          onClick={() => onAction("increase")}
          className={`${base} bg-teal-700 text-white hover:bg-teal-800`}
        >
          Increase
        </button>
      </div>
    </section>
  );
}
