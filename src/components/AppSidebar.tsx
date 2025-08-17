import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Logo from "./Logo";
import { NavUser } from "./NavUser";
import { Button } from "./ui/button";

const data = {
  user: {
    firstName: "Ilyass",
    lastName: "Krichi",
    email: "personal.ilyasskrichi@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = null;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex h-14 w-full items-center justify-center py-4">
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Button className="w-56 self-center">
          <strong>New Note</strong>
        </Button>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={data.user} />
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/log-in">Log in</Link>
            </Button>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
