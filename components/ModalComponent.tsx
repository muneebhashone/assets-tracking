"use client";

import { HTMLAttributes } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const ModalCustom = ({
  isOpen,
  onClose,
  children,
  ...rest
}: ModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={`${rest.className}`} {...rest}>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
