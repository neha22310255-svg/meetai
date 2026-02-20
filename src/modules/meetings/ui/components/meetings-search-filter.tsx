"use client";

import { SearchIcon, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsSearchFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  // Ensure query is always a string to prevent controlled/uncontrolled input errors
  const query = filters.search || "";

  const handleClear = () => {
    // Setting to null usually triggers the hook to remove the key from the URL
    setFilters({ ...filters, search: null });
  };

  return (
    <div className="flex items-center gap-x-2">
      <div className="relative w-full max-w-75">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
        <Input
          placeholder="Search meetings..."
          value={query}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-transparent border-zinc-800 text-white h-9"
        />
      </div>

      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="flex items-center gap-x-2 text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 px-3 border border-zinc-800"
        >
          <XCircle className="size-4" />
          Clear
        </Button>
      )}
    </div>
  );
};
