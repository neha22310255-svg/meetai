"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"; // kept as requested

import { GeneratedAvatar } from "@/components/generated-avatar";
import { CreditCardIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile"; // ✅ added

export const DashboardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const isMobile = useIsMobile(); // ✅ added

  const onLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending) return null;

  // 📱 MOBILE → Drawer
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="outline-none">
          <Avatar className="size-10 border">
            {data?.user.image ? (
              <AvatarImage src={data.user.image} />
            ) : (
              <GeneratedAvatar
                seed={data?.user.name || "User"}
                variant="initials"
              />
            )}
          </Avatar>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data?.user.name}</DrawerTitle>
            <DrawerDescription>{data?.user.email}</DrawerDescription>
          </DrawerHeader>

          <DrawerFooter>
            <Button variant="outline" className="flex gap-2">
              <CreditCardIcon className="size-4" />
              Billing
            </Button>

            <Button
              variant="outline"
              onClick={onLogout}
              className="flex gap-2 text-destructive"
            >
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // 🖥️ DESKTOP → Dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-10 border">
          {data?.user.image ? (
            <AvatarImage src={data.user.image} />
          ) : (
            <GeneratedAvatar
              seed={data?.user.name || "User"}
              variant="initials"
            />
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {data?.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {data?.user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center justify-between text-destructive focus:text-destructive"
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
