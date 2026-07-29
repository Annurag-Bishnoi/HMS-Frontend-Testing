interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <input
      type="text"
      value={value}
      placeholder="Search by Patient ID or Name..."
      onChange={(e) => onChange(e.target.value)}
      className="w-80 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
    />
  );
}