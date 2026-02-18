// "use client";

// import { Button } from "@/components/ui/button";

// interface DataPaginationProps {
//   page: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export const DataPagination = ({
//   page,
//   totalPages,
//   onPageChange,
// }: DataPaginationProps) => {
//   return (
//     <div className="flex items-center justify-between px-4 py-3 border-t">
//       {/* Left side: Navigation buttons */}
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           disabled={page <= 1}
//           onClick={() => onPageChange(Math.max(1, page - 1))}
//           className="px-4 py-2 text-sm"
//         >
//           Previous
//         </Button>

//         <Button
//           variant="outline"
//           size="sm"
//           disabled={page >= totalPages || totalPages === 0}
//           onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//           className="px-4 py-2 text-sm"
//         >
//           Next
//         </Button>
//       </div>

//       {/* Right side: Page info */}
//       <div className="text-sm text-muted-foreground">
//         Page <span className="font-medium text-foreground">{page}</span> of{" "}
//         <span className="font-medium text-foreground">{totalPages || 1}</span>
//       </div>
//     </div>
//   );
// };

"use client";

import { Button } from "@/components/ui/button";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({
  page,
  totalPages,
  onPageChange,
}: DataPaginationProps) => {
  const safeTotalPages = totalPages > 0 ? totalPages : 1;
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);

  const handlePrevious = () => {
    if (safePage > 1) {
      onPageChange(safePage - 1);
    }
  };

  const handleNext = () => {
    if (safePage < safeTotalPages) {
      onPageChange(safePage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={safePage <= 1}
          onClick={handlePrevious}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={safePage >= safeTotalPages}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{safePage}</span> of{" "}
        <span className="font-medium text-foreground">{safeTotalPages}</span>
      </div>
    </div>
  );
};
