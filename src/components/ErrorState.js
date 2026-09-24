export default function ErrorState({
  message = "Something went wrong while loading data.",
  onRetry,
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-red-800">Unable to load</h2>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-hover"
        >
          Retry
        </button>
      )}
    </div>
  );
}
