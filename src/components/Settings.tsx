"use client";

import { deleteSelectedNotesAction } from "@/actions/notes";
import {
  deleteAccountAction,
  deleteAvatarAction,
  getDecryptedApiKeyAction,
  updateApiKeyAction,
  updateAvatarAction,
  updatePasswordAction,
  updateUserAction,
} from "@/actions/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActionHandler } from "@/hooks/use-action-handler";
import useApiKey from "@/hooks/use-api-key";
import useNote from "@/hooks/use-note";
import { Note, User } from "@prisma/client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  AlertTriangle,
  Check,
  Key,
  KeyRound,
  Lock,
  Mail,
  Settings2,
  Trash2,
  Upload,
  UserCog,
  User as UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type NoteWithBody = Pick<
  Note,
  "id" | "title" | "pinned" | "updatedAt" | "createdAt" | "authorId"
> & { body: string };

type Props = {
  user: User | null;
  notes: NoteWithBody[];
  onUpdate: (
    avatar: string | null,
    firstName: string,
    lastName: string,
  ) => void;
};

export default function SettingsDialog({ user, notes, onUpdate }: Props) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { apiKey, setApiKey } = useApiKey();
  const [apiKeySaved, setApiKeySaved] = useState<boolean>(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const { handler: updateProfile, isPending: isUpdatingProfile } =
    useActionHandler(updateUserAction);
  const { handler: deleteAccount, isPending: isDeletingAccount } =
    useActionHandler(deleteAccountAction);
  const { handler: updateApiKey, isPending: isUpdatingApiKey } =
    useActionHandler(updateApiKeyAction);
  const { handler: deleteApiKey, isPending: isDeletingApiKey } =
    useActionHandler(updateApiKeyAction);
  const { handler: deleteNotes, isPending: isDeletingNotes } = useActionHandler(
    deleteSelectedNotesAction,
  );
  const { handler: updateAvatar, isPending: isUpdatingAvatar } =
    useActionHandler(updateAvatarAction);
  const { handler: deleteAvatar, isPending: isDeletingAvatar } =
    useActionHandler(deleteAvatarAction);
  const { handler: updatePassword, isPending: isUpdatingPassword } =
    useActionHandler(updatePasswordAction);
  const { setNotes } = useNote();
  const router = useRouter();

  useEffect(() => {
    const fetchApiKey = async () => {
      const { apiKey: decryptedApiKey } = await getDecryptedApiKeyAction();
      setApiKey(decryptedApiKey || "");
      setApiKeySaved(Boolean(decryptedApiKey));
    };
    fetchApiKey();
  }, [setApiKey, setApiKeySaved]);

  const handleUpdateProfile = async () => {
    updateProfile(
      {
        onSuccess: () => {
          onUpdate(avatar || "", firstName, lastName);
        },
        loadingMessage: "Updating profile...",
        successMessage: "Profile updated successfully",
        successDescription: "Your profile has been updated successfully.",
        errorMessage: "Failed to update profile",
      },
      firstName,
      lastName,
    );
  };

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    updatePassword(
      {
        loadingMessage: "Updating password...",
        successMessage: "Password updated successfully",
        successDescription: "Your password has been updated successfully.",
        errorMessage: "Failed to update password",
      },
      password,
    );
  };

  const handleDeleteAccount = async () => {
    deleteAccount({
      onSuccess: () => {
        router.replace("/");
      },
      loadingMessage: "Deleting account...",
      successMessage: "Account deleted successfully",
      successDescription: "Your account has been deleted successfully.",
      errorMessage: "Failed to delete account",
      errorDescription: "Please try again later.",
    });
  };

  const handleUpdateApiKey = async () => {
    updateApiKey(
      {
        onSuccess: () => {
          setApiKeySaved(true);
        },
        loadingMessage: "Updating API key...",
        successMessage: "API key updated successfully",
        successDescription: "Your API key has been updated successfully.",
        errorMessage: "Failed to update API key",
      },
      apiKey || "",
    );
  };

  const handleDeleteApiKey = async () => {
    deleteApiKey(
      {
        onSuccess: () => {
          setApiKey("");
          setApiKeySaved(false);
        },
        loadingMessage: "Deleting API key...",
        successMessage: "API key deleted successfully",
        successDescription: "Your API key has been deleted successfully.",
        errorMessage: "Failed to delete API key",
      },
      "",
    );
  };

  const handleDeleteNotes = async () => {
    deleteNotes(
      {
        onSuccess: () => {
          setNotes(notes.filter((note) => !selectedNotes.includes(note.id)));
          setSelectedNotes([]);
          router.replace("/");
        },
        loadingMessage: "Deleting notes...",
        successMessage: "Notes deleted successfully",
        successDescription: "Your notes have been deleted successfully.",
        errorMessage: "Failed to delete notes",
      },
      selectedNotes,
    );
  };

  const handleEditAvatar = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png, image/webp, image/gif";
    fileInput.multiple = false;
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("avatar", file);
        updateAvatar(
          {
            onSuccess: (result) => {
              if (result.avatarUrl) {
                setAvatar(result.avatarUrl);
                onUpdate(result.avatarUrl, firstName, lastName);
              }
            },
            loadingMessage: "Updating avatar...",
            successMessage: "Avatar updated successfully",
            successDescription: "Your avatar has been updated successfully.",
            errorMessage: "Failed to update avatar",
          },
          formData,
        );
      }
    };
    fileInput.click();
  };

  const handleDeleteAvatar = async () => {
    deleteAvatar(
      {
        onSuccess: () => {
          setAvatar(null);
          onUpdate(null, firstName, lastName);
        },
        loadingMessage: "Deleting avatar...",
        successMessage: "Avatar deleted successfully",
        successDescription: "Your avatar has been deleted successfully.",
        errorMessage: "Failed to delete avatar",
      },
      avatar || "",
    );
  };

  const handleSelectAllNotes = (checked: boolean) => {
    setSelectedNotes(checked ? notes.map((note) => note.id) || [] : []);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
    );
  };

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Last Updated",
      accessorKey: "lastUpdated",
    },
  ];

  const table = useReactTable({
    data:
      notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    manualSorting: false,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="size-7">
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex min-w-2xl flex-col items-center max-sm:min-w-sm!">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mx-auto grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <UserCog className="size-4 max-sm:mr-0" />
              <span className="sr-only pb-0.5 md:not-sr-only">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="size-4 max-sm:mr-0" />
              <span className="sr-only pb-0.5 md:not-sr-only">Password</span>
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <KeyRound className="size-4 max-sm:mr-0" />
              <span className="sr-only pb-0.5 md:not-sr-only">
                Integrations
              </span>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <Trash2 className="size-4 max-sm:mr-0" />
              <span className="sr-only pb-0.5 md:not-sr-only">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="danger-zone">
              <AlertTriangle className="size-4 max-sm:mr-0" />
              <span className="sr-only pb-0.5 md:not-sr-only">Danger Zone</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-2" value="profile">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-[80%] flex-col items-center gap-4">
                <div className="flex items-center gap-2 font-semibold">
                  <UserIcon className="size-5" />{" "}
                  <span className="pb-0.5">User Profile</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Avatar className="relative size-32 max-sm:size-24">
                    <AvatarImage src={avatar || undefined} />
                    <AvatarFallback className="group text-5xl">
                      {firstName.charAt(0).toUpperCase()}
                      {lastName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground text-sm font-semibold">
                      Max size: 2MB
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        className="flex items-center justify-center text-xs"
                        onClick={handleEditAvatar}
                        disabled={isUpdatingAvatar}
                      >
                        <Upload className="size-4" />
                        <span className="hidden pb-0.5 font-semibold md:inline">
                          {isUpdatingAvatar ? "Uploading..." : "Upload Avatar"}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center justify-center text-xs ${
                          avatar === null ? "hidden" : ""
                        }`}
                        onClick={handleDeleteAvatar}
                        disabled={isDeletingAvatar || avatar === null}
                      >
                        <X className="size-4" />
                        <span className="hidden pb-0.5 font-semibold md:inline">
                          {isDeletingAvatar ? "Deleting..." : "Delete Avatar"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <form
                  action={handleUpdateProfile}
                  className="flex w-full flex-col items-center gap-4"
                >
                  <div className="grid w-full grid-cols-2 gap-2 max-sm:grid-cols-1">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        disabled={isUpdatingProfile}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        disabled={isUpdatingProfile}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-[50%]"
                    disabled={
                      isUpdatingProfile ||
                      firstName.length === 0 ||
                      lastName.length === 0
                    }
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="mt-2" value="password">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-[80%] flex-col items-center gap-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Lock className="size-5" />
                  <span className="pb-0.5">Change Password</span>
                </div>
                <form
                  action={handleUpdatePassword}
                  className="flex w-full flex-col items-center gap-4"
                >
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-[50%]"
                    disabled={
                      isUpdatingPassword ||
                      password.length === 0 ||
                      confirmPassword.length === 0
                    }
                  >
                    {isUpdatingPassword ? "Saving..." : "Save Password"}
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="mt-2" value="integrations">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-[80%] flex-col items-center gap-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Key className="size-5" />{" "}
                  <span className="pb-0.5 whitespace-nowrap">
                    OpenAI API Key (gpt-4o-mini)
                  </span>
                </div>
                <form
                  action={handleUpdateApiKey}
                  className="flex w-full flex-col items-center gap-4"
                >
                  <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      type="password"
                      value={apiKey || ""}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your OpenAI API Key"
                      pattern="^sk-proj-[A-Za-z0-9-_]{74}T3BlbkFJ[A-Za-z0-9-_]{74}$"
                      disabled={isUpdatingApiKey || apiKeySaved}
                    />
                    <p
                      className={`text-muted-foreground text-xs ${
                        apiKey &&
                        apiKey.length > 0 &&
                        !apiKey.match(
                          /^sk-proj-[A-Za-z0-9-_]{74}T3BlbkFJ[A-Za-z0-9-_]{74}$/,
                        )
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      Your Project API key is not valid. Please enter a valid
                      Project API key.
                    </p>
                  </div>
                  <div className="flex w-[80%] items-center justify-center gap-1">
                    <Button
                      type="submit"
                      className="w-[50%]"
                      disabled={
                        isUpdatingApiKey ||
                        apiKeySaved ||
                        apiKey?.length === 0 ||
                        !apiKey?.match(
                          /^sk-proj-[A-Za-z0-9-_]{74}T3BlbkFJ[A-Za-z0-9-_]{74}$/,
                        )
                      }
                    >
                      {isUpdatingApiKey ? "Saving..." : "Save API Key"}
                    </Button>
                    {apiKeySaved && (
                      <Button
                        variant="outline"
                        className="w-[50%]"
                        onClick={handleDeleteApiKey}
                        disabled={isDeletingApiKey}
                      >
                        {isDeletingApiKey ? "Deleting..." : "Delete API Key"}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="mt-2" value="notes">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-[80%] flex-col items-center gap-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Trash2 className="size-5" />
                  <span className="pb-0.5">Delete Notes</span>
                </div>
                <div className="mt-2 flex w-full items-end justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex h-8 items-center gap-2.5 px-4 text-xs"
                      onClick={() =>
                        handleSelectAllNotes(
                          selectedNotes.length !== notes.length,
                        )
                      }
                    >
                      <div
                        className={`border-input size-4 shrink-0 rounded-sm border ${
                          selectedNotes.length === notes.length &&
                          notes.length !== 0
                            ? "border-primary"
                            : ""
                        }`}
                      >
                        <div className="text-primary-foreground flex items-center justify-center">
                          <Check
                            className={`size-3.5 ${
                              selectedNotes.length === notes.length &&
                              notes.length !== 0
                                ? "bg-primary"
                                : ""
                            } ${
                              selectedNotes.length !== notes.length ||
                              notes.length === 0
                                ? "opacity-0"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                      <span className="hidden text-sm font-semibold md:inline">
                        Select All
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex h-8 gap-1 px-3 text-sm whitespace-nowrap ${
                        selectedNotes.length === 0 ? "hidden" : ""
                      }`}
                      onClick={() => handleSelectAllNotes(false)}
                    >
                      Clear<span className="hidden md:inline"> Selection</span>
                    </Button>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex h-8 items-center gap-2 px-3 text-xs"
                        disabled={selectedNotes.length === 0 || isDeletingNotes}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only font-semibold md:not-sr-only">
                          {isDeletingNotes ? "Deleting..." : "Delete"}
                          {selectedNotes.length > 0 &&
                            ` (${selectedNotes.length})`}
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-bold">
                          Delete Selected Notes
                        </AlertDialogTitle>
                        <AlertDialogDescription className="font-semibold">
                          Are you sure you want to delete {selectedNotes.length}{" "}
                          notes? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="font-bold"
                          onClick={handleDeleteNotes}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="max-h-[200px] w-full overflow-y-auto rounded-sm border">
                  <Table>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleNoteSelect(row.original.id)}
                          >
                            <TableCell className="ml-2 flex items-center gap-3 font-semibold">
                              <div className="flex w-fit items-center justify-center">
                                <Checkbox
                                  checked={selectedNotes.includes(
                                    row.original.id,
                                  )}
                                  onCheckedChange={() =>
                                    handleNoteSelect(row.original.id)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              {row.original.title}
                            </TableCell>
                            <TableCell className="pr-3 text-right text-xs font-semibold">
                              {row.original.createdAt.toLocaleDateString()},{" "}
                              {row.original.createdAt.toLocaleTimeString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center font-semibold"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="mt-2" value="danger-zone">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-[80%] flex-col items-center gap-4">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="size-5" />
                  <span className="pb-0.5">Danger Zone</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="flex h-12 w-[50%] items-center gap-2 px-3 text-lg"
                      disabled={isDeletingAccount}
                    >
                      <Trash2 className="size-6" />
                      <span className="sr-only font-semibold md:not-sr-only">
                        {isDeletingAccount ? "Deleting..." : "Delete Account"}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold">
                        Delete Account
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-semibold">
                        Are you sure you want to delete your account? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="font-bold">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="font-bold"
                        onClick={handleDeleteAccount}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="mt-4" />
        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <Mail className="size-5" />{" "}
            <span className="pb-0.5">Contact Us</span>
          </div>
          <div className="flex w-full flex-col items-center gap-1">
            <p>
              Have questions or feedback? Reach out to us at{" "}
              <Link
                href="mailto:personal.ilyasskrichi@gmail.com"
                className="text-ring hover:text-ring/80 hover:underline"
              >
                personal.ilyasskrichi@gmail.com
              </Link>
            </p>
            <p>
              We value your input and are always looking to improve our app!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
