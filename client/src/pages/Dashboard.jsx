// The private page: counter + history.
import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api";
import Navbar from "../components/Navbar";
import CounterCard from "../components/CounterCard";
import HistoryList from "../components/HistoryList";

export default function Dashboard() {
  const [value, setValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // true while first loading data
  const [busy, setBusy] = useState(false); // true while a button click is being saved
  const [error, setError] = useState("");

  // Runs once when the page opens: fetch the counter and history together.
  useEffect(() => {
    const loadData = async () => {
      try {
        const [counterRes, historyRes] = await Promise.all([
          api.get("/counter"),
          api.get("/counter/history"),
        ]);
        setValue(counterRes.data.value);
        setHistory(historyRes.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // action is "increase", "decrease" or "reset"
  const handleAction = async (action) => {
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post(`/counter/${action}`);
      setValue(data.value);
      setHistory((old) => [data.entry, ...old]); // put the new entry at the top
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        {loading ? (
          <p className="py-12 text-center text-slate-500">Loading your counter...</p>
        ) : (
          <>
            <CounterCard value={value} busy={busy} onAction={handleAction} />
            <HistoryList history={history} />
          </>
        )}
      </main>
    </div>
  );
}
