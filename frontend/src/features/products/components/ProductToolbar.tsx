import { Search, ArrowDownWideNarrow } from "lucide-react";

interface ProductToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export default function ProductToolbar({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}: ProductToolbarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Sorting */}
      <div className="relative w-full sm:w-56">
        <ArrowDownWideNarrow
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <select
          value={sortOrder}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sort products"
          className="h-12 w-full appearance-none rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="default">Default Sorting</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
