export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-600">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-primary"
        aria-hidden="true"
      />
      <p className="text-sm">{message}</p>
    </div>
  );
}
