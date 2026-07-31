interface Props {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="mt-6 flex items-center justify-between">

      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="rounded-xl border px-5 py-2 disabled:opacity-40"
      >
        Previous
      </button>

      <span className="font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="rounded-xl border px-5 py-2 disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
}