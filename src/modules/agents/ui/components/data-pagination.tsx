"use client";

import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Left side: Navigation buttons */}
      <div className="flex items-center">
        <nav className="inline-flex -space-x-px rounded-md shadow-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="rounded-r-none border-r-0 px-3 py-1.5 text-sm"
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="rounded-l-none px-3 py-1.5 text-sm"
          >
            Next
          </Button>
        </nav>
      </div>

      {/* Right side: Page info */}
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages || 1}</span>
      </div>
    </div>
  );
};
