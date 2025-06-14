type SearchBarProps = {
  handleSearch: (query: string) => void;
};

export default function SearchBar({ handleSearch }: SearchBarProps) {
  return (
    <div className="w-full flex items-center gap-x-4 my-4 relative">
      <input
        type="search"
        placeholder="Search projects..."
        className="w-full border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block px-2 py-1 bg-gray-800"
        onChange={e => handleSearch(e.target.value)}
      />
    </div>
  );
}
