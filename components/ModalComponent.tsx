"use client";

import { DetailedHTMLProps, HTMLAttributes } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

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
      <DialogContent
        className={`${rest.className}`}
        {...rest}
      >
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
