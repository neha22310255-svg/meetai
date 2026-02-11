"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

/* ------------------------------------------------------------------ */
/* Command root */
/* ------------------------------------------------------------------ */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(
      "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

/* ------------------------------------------------------------------ */
/* Command Input */
/* ------------------------------------------------------------------ */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    data-slot="command-input-wrapper"
    className="flex h-12 items-center gap-2 border-b px-3"
  >
    <SearchIcon className="size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      data-slot="command-input"
      className={cn(
        "placeholder:text-muted-foreground flex h-full w-full bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

/* ------------------------------------------------------------------ */
/* Command List */
/* ------------------------------------------------------------------ */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn("max-h-75 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

/* ------------------------------------------------------------------ */
/* Command Empty */
/* ------------------------------------------------------------------ */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={cn("py-6 text-center text-sm", className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

/* ------------------------------------------------------------------ */
/* Command Group */
/* ------------------------------------------------------------------ */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      "overflow-hidden p-1 text-foreground",
      ":[[cmdk-group-heading]]:px-2",
      ":[[cmdk-group-heading]]:py-1.5",
      ":[[cmdk-group-heading]]:text-xs",
      ":[[cmdk-group-heading]]:font-medium",
      ":[[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

/* ------------------------------------------------------------------ */
/* Command Separator */
/* ------------------------------------------------------------------ */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn("bg-border -mx-1 h-px", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

/* ------------------------------------------------------------------ */
/* Command Item */
/* ------------------------------------------------------------------ */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

/* ------------------------------------------------------------------ */
/* Responsive Dialog / Drawer */
/* ------------------------------------------------------------------ */
interface CommandResponsiveDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  title?: string;
  description?: string;
  shouldFilter?: boolean;
  children?: React.ReactNode;
}

function CommandResponsiveDialog({
  title,
  description,
  children,
  shouldFilter = true,
  ...props
}: CommandResponsiveDialogProps) {
  const isMobile = useIsMobile();

  const commandClassName = cn(
    ":[[cmdk-group-heading]]:px-2",
    ":[[cmdk-group-heading]]:py-1.5",
    ":[[cmdk-group-heading]]:text-xs",
    ":[[cmdk-group-heading]]:font-medium",
    ":[[cmdk-group-heading]]:text-muted-foreground",
    ":[[cmdk-group]]:px-2",
    ":[[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
    ":[[cmdk-input-wrapper]_svg]:h-5",
    ":[[cmdk-input-wrapper]_svg]:w-5",
    ":[[cmdk-input]]:h-12",
    ":[[cmdk-item]]:px-2",
    ":[[cmdk-item]]:py-3",
    ":[[cmdk-item]_svg]:h-5",
    ":[[cmdk-item]_svg]:w-5",
  );

  if (isMobile) {
    return (
      <Drawer {...props}>
        <DrawerContent className="overflow-hidden p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <Command shouldFilter={shouldFilter} className={commandClassName}>
            {children}
          </Command>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Command shouldFilter={shouldFilter} className={commandClassName}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Exports */
/* ------------------------------------------------------------------ */
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandResponsiveDialog,
  CommandResponsiveDialog as CommandDialog,
};
