"use client";
import {
  useGetSupportFormById,
  useGetSupportFormMessages,
} from "@/services/admin/support.queries";
import {
  useCreateSupportMessage,
  useResolveSupportForm,
} from "@/services/admin/support.mutations";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface SupportDetailPageProps {
  id: string;
}

const SupportDetailPage = ({ id }: SupportDetailPageProps) => {
  const { data: supportForm, isLoading: isSupportLoading } =
    useGetSupportFormById({ id });
  const { data: messages, isLoading: isMessagesLoading } =
    useGetSupportFormMessages({ id });
  const { mutate: createMessage, isPending: isCreatingMessage } =
    useCreateSupportMessage();
  const { mutate: resolveForm, isPending: isResolving } =
    useResolveSupportForm();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const handleSubmitMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    createMessage(
      {
        message: message.trim(),
        supportFormId: Number(id),
      },
      {
        onSuccess: () => {
          setMessage("");
          toast({
            title: "Success",
            description: "Message sent successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to send message",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleResolveForm = () => {
    resolveForm(
      { id: Number(id) },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Support form has been resolved",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to resolve support form",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (isSupportLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support Ticket #{id}</h1>
            <p className="text-muted-foreground mt-1">
              Created:{" "}
              {supportForm?.data.createdAt
                ? format(new Date(supportForm.data.createdAt), "PPP")
                : "N/A"}
            </p>
          </div>
          <Badge
            className={`text-sm px-3 py-1 ${
              supportForm?.data?.resolved
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            }`}
          >
            {supportForm?.data.resolved ? "Resolved" : "Pending"}
          </Badge>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Ticket Details</CardTitle>
              {!supportForm?.data.resolved && (
                <Button
                  onClick={handleResolveForm}
                  disabled={isResolving}
                  variant="outline"
                  className="ml-auto"
                >
                  {isResolving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resolving...
                    </>
                  ) : (
                    "Resolve Ticket"
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="font-medium text-muted-foreground">
                  Name
                </Label>
                <p className="font-medium">{supportForm?.data.name ?? "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="font-medium break-all">
                  {supportForm?.data.email ?? "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-muted-foreground">
                  Phone Number
                </Label>
                <p className="font-medium">
                  {supportForm?.data.phoneNo ?? "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-muted-foreground">
                  Subject
                </Label>
                <p className="font-medium">
                  {supportForm?.data.subject ?? "N/A"}
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="font-medium text-muted-foreground">
                  Issue
                </Label>
                <p className="font-medium">{supportForm?.data.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Your Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-96 overflow-y-auto p-1">
              {isMessagesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : messages?.data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-4">
                  {messages?.data.map((msg) => (
                    <div key={msg.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex justify-between gap-4">
                        <p className="text-wrap flex-1">{msg.message}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(msg.createdAt), "PPp")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Textarea
              placeholder="Type your reply here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none w-full"
              disabled={supportForm?.data.resolved}
            />
            <Button
              onClick={handleSubmitMessage}
              disabled={
                isCreatingMessage ||
                !message.trim() ||
                supportForm?.data.resolved
              }
              className="w-full sm:w-auto ml-auto"
            >
              {isCreatingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reply"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SupportDetailPage;
