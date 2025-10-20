import { toast } from "@/components/ui/use-toast";
import {
  useBuildShipmentShareableLink,
  useEmailShareableLink,
} from "@/services/shipment.mutations";
import { Shipment } from "@/services/shipment.queries";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";

interface ShareShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
}

export default function ShareShipmentModal({
  isOpen,
  onClose,
  shipment,
}: ShareShipmentModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [generatedLink, setGeneratedLink] = useState<string>("");

  const { mutate: createLink, isPending: isCreatingLink } =
    useBuildShipmentShareableLink({
      async onSuccess(data) {
        setGeneratedLink(data.data.shareableLink);
        toast({
          variant: "default",
          description: "Shareable link generated",
          title: "Success",
        });
      },
      onError(error) {
        toast({
          variant: "destructive",
          description: error.response?.data.message,
          title: "Error",
        });
      },
    });

  const { mutate: sendLink, isPending: isSendingLink } = useEmailShareableLink({
    onSuccess(data) {
      setEmails([]);
      toast({
        variant: "default",
        description: "Email sent successfully",
        title: "Success",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (shipment.shareToken) {
        setGeneratedLink(
          `https://platform.fratezone.com/view-shipment?token=${shipment.shareToken}`,
        );
      }

      // Generate Share Token if it doesn't exist
      else if (!generatedLink && !isCreatingLink) {
        createLink({ shipmentId: String(shipment.id) });
      }
    }
  }, [isOpen, generatedLink, isCreatingLink, shipment, createLink]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setGeneratedLink("");
        setEmails([]);
      }}
      title="Share shipment link"
      description="Generate a sharable link, copy it, or send via email."
    >
      {generatedLink && (
        <div className="space-y-4">
          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Shareable Link</label>
            <div className="flex items-center gap-2">
              <Input
                value={generatedLink}
                readOnly
                placeholder={
                  isCreatingLink
                    ? "Generating link..."
                    : "Click Generate to create link"
                }
              />
              <Button
                variant="secondary"
                disabled={!generatedLink}
                className="w-36"
                onClick={async () => {
                  if (!generatedLink) return;
                  await navigator.clipboard.writeText(generatedLink);
                  toast({
                    title: "Copied",
                    description: "Link copied to clipboard",
                  });
                }}
              >
                Copy link
              </Button>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email addresses</label>
            <TagsInput
              value={emails}
              onChange={setEmails}
              placeHolder="Enter email addresses..."
              separators={[",", " ", "Enter"]}
              classNames={{
                input:
                  "bg-white !w-full !text-sm placeholder:!text-muted-foreground",
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {/* Send Email */}
            <Button
              disabled={emails.length === 0 || isSendingLink}
              onClick={() => sendLink({ emails, shipmentId: shipment.id })}
            >
              Send email
            </Button>
          </div>
        </div>
      )}

      {!generatedLink && (
        <div className="flex items-center justify-center gap-4 flex-col text-muted-foreground h-[200px]">
          <Loader2 className="size-8 animate-spin" />
          <p>Generating link...</p>
        </div>
      )}
    </Modal>
  );
}
