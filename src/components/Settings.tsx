"use client";

import { deleteSelectedNotesAction } from "@/actions/notes";
import {
  deleteAccountAction,
  deleteAvatarAction,
  getDecryptedApiKeyAction,
  updateApiKeyAction,
  updateAvatarAction,
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
import { Note, User } from "@prisma/client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  AlertCircle,
  Check,
  Key,
  KeyRound,
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
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  user: User | null;
  notes: Note[] | null;
  onSelectedNotesDeleted: (selectedNotes: string[]) => void;
};

export default function SettingsDialog({
  user,
  notes: initialNotes,
  onSelectedNotesDeleted,
}: Props) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState<boolean>(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [notes, setNotes] = useState(
    initialNotes?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchApiKey = async () => {
      const { apiKey: decryptedApiKey } = await getDecryptedApiKeyAction();
      setApiKey(decryptedApiKey || "");
      setApiKeySaved(Boolean(decryptedApiKey));
    };
    fetchApiKey();
  }, []);

  const handleUpdateProfile = async () => {
    startTransition(() => {
      const promise = new Promise(async (resolve, reject) => {
        const result = await updateUserAction(firstName, lastName);
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          resolve(result);
        }
      });
      toast.promise(promise, {
        loading: "Updating profile...",
        success: () => {
          return {
            message: "Profile updated successfully",
            description: "Your profile has been updated successfully.",
          };
        },
        error: (error) => {
          return {
            message: "Profile update failed",
            description: error.message,
          };
        },
      });
    });
  };

  const handleUpdateApiKey = async () => {
    startTransition(() => {
      const promise = new Promise(async (resolve, reject) => {
        const result = await updateApiKeyAction(apiKey);
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          setApiKeySaved(true);
          resolve(result);
        }
      });
      toast.promise(promise, {
        loading: "Updating API Key...",
        success: () => {
          return "API Key updated successfully";
        },
        error: (error) => {
          return {
            message: "API Key update failed",
            description: error.message,
          };
        },
      });
    });
  };

  const handleDeleteApiKey = async () => {
    startTransition(() => {
      const promise = new Promise(async (resolve, reject) => {
        const result = await updateApiKeyAction("");
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          resolve(result);
        }
      });
      toast.promise(promise, {
        loading: "Deleting API Key...",
        success: () => {
          setApiKey("");
          setApiKeySaved(false);
          return {
            message: "API Key deleted successfully",
            description: "Your API key has been deleted successfully.",
          };
        },
        error: (error) => {
          return {
            message: "API Key deletion failed",
            description: error.message,
          };
        },
      });
    });
  };

  const handleDeleteNotes = async () => {
    startTransition(() => {
      const promise = new Promise(async (resolve, reject) => {
        const result = await deleteSelectedNotesAction(selectedNotes);
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          resolve(result);
        }
      });
      toast.promise(promise, {
        loading: "Deleting selected notes...",
        success: () => {
          onSelectedNotesDeleted(selectedNotes);
          setNotes(notes?.filter((note) => !selectedNotes.includes(note.id)));
          setSelectedNotes([]);
          return {
            message: `${selectedNotes.length} ${selectedNotes.length === 1 ? "Note" : "Notes"} deleted successfully`,
            description: `You have successfully deleted ${selectedNotes.length} ${selectedNotes.length === 1 ? "note" : "notes"}.`,
          };
        },
        error: (error) => {
          return {
            message: "Note deletion failed",
            description: error.message,
          };
        },
      });
    });
  };

  const handleEditAvatar = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png, image/webp, image/gif";
    fileInput.multiple = false;
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        startTransition(() => {
          const promise = new Promise<{
            errorMessage: string | null;
            avatarUrl: string | null;
          }>(async (resolve, reject) => {
            const result = await updateAvatarAction(file);
            if (result.errorMessage) {
              reject(new Error(result.errorMessage));
            } else {
              resolve(result);
            }
          });

          toast.promise(promise, {
            loading: "Updating avatar...",
            success: (result) => {
              if (result.avatarUrl) {
                setAvatar(result.avatarUrl);
              }
              return {
                message: "Avatar updated successfully",
                description: "Your avatar has been updated successfully.",
              };
            },
            error: (error) => {
              return {
                message: "Avatar update failed",
                description: error.message,
              };
            },
          });
        });
      }
    };
    fileInput.click();
  };

  const handleDeleteAvatar = async () => {
    startTransition(() => {
      const promise = new Promise(async (resolve, reject) => {
        const result = await updateAvatarAction(null);
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          const { errorMessage } = await deleteAvatarAction();
          if (errorMessage) reject(new Error(errorMessage));
          resolve(result);
        }
      });
      toast.promise(promise, {
        loading: "Deleting avatar...",
        success: () => {
          setAvatar(null);
          return {
            message: "Avatar deleted successfully",
            description: "Your avatar has been deleted successfully.",
          };
        },
        error: (error) => {
          return {
            message: "Avatar deletion failed",
            description: error.message,
          };
        },
      });
    });
  };

  const handleDeleteAccount = async () => {
    startTransition(() => {
      const promise = new Promise(async (resolve, reject) => {
        const result = await deleteAccountAction();
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          resolve(result);
        }
      });
      toast.promise(promise, {
        loading: "Deleting account...",
        success: () => {
          router.replace("/");
          return {
            message: "Account deleted successfully",
            description: "Your account has been deleted successfully.",
          };
        },
        error: () => {
          return {
            message: "Account deletion failed",
            description:
              "Please try again later or contact us if the problem persists.",
          };
        },
      });
    });
  };

  const handleSelectAllNotes = (checked: boolean) => {
    setSelectedNotes(checked ? notes?.map((note) => note.id) || [] : []);
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
    data: notes || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="size-7">
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex min-w-2xl flex-col items-center max-sm:!min-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mx-auto grid w-[85%] grid-cols-4">
            <TabsTrigger value="profile">
              <UserCog className="size-4 max-sm:mr-0" />
              <span className="sr-only pb-0.5 md:not-sr-only">Profile</span>
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
              <Trash2 className="size-4 max-sm:mr-0" />
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
                        disabled={isPending}
                      >
                        <Upload className="size-4" />
                        <span className="hidden pb-0.5 font-semibold md:inline">
                          Upload Avatar
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center justify-center text-xs ${
                          avatar === null ? "hidden" : ""
                        }`}
                        onClick={handleDeleteAvatar}
                        disabled={isPending || avatar === null}
                      >
                        <X className="size-4" />
                        <span className="hidden pb-0.5 font-semibold md:inline">
                          Delete Avatar
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-2 max-sm:grid-cols-1">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      disabled={isPending}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      disabled={isPending}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleUpdateProfile}
                  className="w-[50%]"
                  disabled={
                    isPending || firstName.length === 0 || lastName.length === 0
                  }
                >
                  Save Profile
                </Button>
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
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API Key"
                    pattern="^sk-proj-[A-Za-z0-9-_]{74}T3BlbkFJ[A-Za-z0-9-_]{74}$"
                    disabled={isPending || apiKeySaved}
                  />
                  <p
                    className={`text-muted-foreground text-xs ${
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
                    onClick={handleUpdateApiKey}
                    className="w-[50%]"
                    disabled={
                      isPending ||
                      apiKeySaved ||
                      apiKey.length === 0 ||
                      !apiKey.match(
                        /^sk-proj-[A-Za-z0-9-_]{74}T3BlbkFJ[A-Za-z0-9-_]{74}$/,
                      )
                    }
                  >
                    Save API Key
                  </Button>
                  {apiKeySaved && (
                    <Button
                      variant="outline"
                      className="w-[50%]"
                      onClick={handleDeleteApiKey}
                      disabled={isPending}
                    >
                      Delete API Key
                    </Button>
                  )}
                </div>
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
                          selectedNotes.length !== (notes?.length || 0),
                        )
                      }
                    >
                      <div
                        className={`border-input size-4 shrink-0 rounded-sm border ${
                          selectedNotes.length === (notes?.length || 0)
                            ? "border-primary"
                            : ""
                        }`}
                      >
                        <div className="text-primary-foreground flex items-center justify-center">
                          <Check
                            className={`size-3.5 ${
                              selectedNotes.length === (notes?.length || 0)
                                ? "bg-primary"
                                : ""
                            } ${
                              selectedNotes.length !== (notes?.length || 0)
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
                        disabled={selectedNotes.length === 0 || isPending}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only font-semibold md:not-sr-only">
                          Delete
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
                  <AlertCircle className="size-5" />
                  <span className="pb-0.5">Danger Zone</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="flex h-12 w-[50%] items-center gap-2 px-3 text-lg"
                      disabled={isPending}
                    >
                      <Trash2 className="size-6" />
                      <span className="sr-only font-semibold md:not-sr-only">
                        Delete Account
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
