type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="w-full flex items-center gap-x-4 my-6 relative">
      <input
        type="search"
        placeholder="Search projects..."
        className="w-full border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block px-2 py-1 bg-gray-800"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
