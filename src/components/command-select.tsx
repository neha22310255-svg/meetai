// import { ReactNode, useState } from "react";
// import { ChevronsUpDownIcon } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandResponsiveDialog,
// } from "@/components/ui/command";

// interface Props {
//   options: Array<{
//     id: string;
//     value: string;
//     children: ReactNode;
//   }>;
//   onSelect: (value: string) => void;
//   onSearch?: (value: string) => void;
//   value: string;
//   placeholder?: string;
//   isSearchable?: boolean;
//   className?: string;
// }

// export const CommandSelect = ({
//   options,
//   onSelect,
//   onSearch,
//   value,
//   placeholder = "Select an option",
//   isSearchable = true,
//   className,
// }: Props) => {
//   const [open, setOpen] = useState(false);
//   const selectedOption = options.find((option) => option.value === value);

//   return (
//     <>
//       <Button
//         type="button"
//         variant="outline"
//         role="combobox"
//         aria-expanded={open}
//         onClick={() => setOpen(true)}
//         className={cn(
//           "h-9 justify-between font-normal px-2 w-full",
//           !selectedOption && "text-muted-foreground",
//           className,
//         )}
//       >
//         <span className="truncate">
//           {selectedOption?.children ?? placeholder}
//         </span>
//         <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//       </Button>

//       <CommandResponsiveDialog
//         open={open}
//         onOpenChange={setOpen}
//         title="Select option"
//         description="Choose an option from the list"
//       >
//         {isSearchable && (
//           <CommandInput placeholder="Search..." onValueChange={onSearch} />
//         )}
//         <CommandList>
//           {options.length === 0 && (
//             <span className="text-muted-foreground text-sm px-2 py-1 block">
//               No options found
//             </span>
//           )}
//           {options.map((option) => (
//             <CommandItem
//               key={option.id}
//               value={option.value}
//               onSelect={(currentValue) => {
//                 onSelect(currentValue);
//                 setOpen(false);
//               }}
//             >
//               {option.children}
//             </CommandItem>
//           ))}
//         </CommandList>
//       </CommandResponsiveDialog>
//     </>
//   );
// };

import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable = true,
  className,
  title = "Select an agent",
  description = "Search and select an agent for your meeting",
  emptyMessage = "No options found",
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const TriggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn("w-full justify-between", className)}
      onClick={() => setOpen(true)}
    >
      <span className="truncate">
        {selectedOption?.children ?? placeholder}
      </span>
      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const CommandContent = (
    <Command className="rounded-lg border shadow-md" shouldFilter={!onSearch}>
      {isSearchable && (
        <CommandInput
          placeholder="Search..."
          onValueChange={onSearch}
          autoFocus
        />
      )}
      <CommandList>
        <CommandEmpty>
          <span className="text-muted-foreground text-sm">{emptyMessage}</span>
        </CommandEmpty>
        {options.map((option) => (
          <CommandItem
            key={option.id}
            value={option.value}
            onSelect={(currentValue) => {
              onSelect(currentValue);
              setOpen(false);
            }}
          >
            {option.children}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );

  return (
    <>
      {TriggerButton}
      <CommandResponsiveDialog
        title={title}
        description={description}
        open={open}
        onOpenChange={setOpen}
        shouldFilter={!onSearch}
      >
        {CommandContent}
      </CommandResponsiveDialog>
    </>
  );
};
