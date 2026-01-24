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
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Responsive Dialog / Drawer */
/* ------------------------------------------------------------------ */
export function CommandResponsiveDialog({
  title,
  description,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title: string;
  description: string;
}) {
  const isMobile = useIsMobile();

  const commandClassName = `
    [&>*[cmdk-group-heading]]:text-muted-foreground
    [&>*[data-slot=command-input-wrapper]]:h-12
    [&>*[cmdk-group-heading]]:px-2
    [&>*[cmdk-group-heading]]:font-medium
    [&>*[cmdk-group]]:px-2
    [&>*[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0
    [&>*[cmdk-input-wrapper]_svg]:h-5
    [&>*[cmdk-input-wrapper]_svg]:w-5
    [&>*[cmdk-input]]:h-12
    [&>*[cmdk-item]]:px-2
    [&>*[cmdk-item]]:py-3
    [&>*[cmdk-item]_svg]:h-5
    [&>*[cmdk-item]_svg]:w-5
  `;

  if (isMobile) {
    return (
      <Drawer {...props}>
        <DrawerContent className="overflow-hidden p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <Command className=" [&>*[cmdk-group-heading]]:text-muted-foreground [&>*[data-slot=command-input-wrapper]]:h-12 [&>*[cmdk-group-heading]]:px-2 [&>*[cmdk-group-heading]]:font-medium [&>*[cmdk-group]]:px-2 [&>*[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&>*[cmdk-input-wrapper]_svg]:h-5 [&>*[cmdk-input-wrapper]_svg]:w-5 [&>*[cmdk-input]]:h-12 [&>*[cmdk-item]]:px-2 [&>*[cmdk-item]]:py-3 [&>*[cmdk-item]_svg]:h-5 [&>*[cmdk-item]_svg]:w-5">
            {children}
          </Command>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <DialogContent className="overflow-hidden p-0">
        <Command className={commandClassName}>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Command Input */
/* ------------------------------------------------------------------ */
export function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-12 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-full w-full bg-transparent py-3 text-sm outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Command List / Item */
/* ------------------------------------------------------------------ */
export function CommandList(
  props: React.ComponentProps<typeof CommandPrimitive.List>,
) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className="max-h-75 overflow-y-auto"
      {...props}
    />
  );
}

export function CommandItem(
  props: React.ComponentProps<typeof CommandPrimitive.Item>,
) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
      {...props}
    />
  );
}
