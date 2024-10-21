"use client";

import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LabeledButtonProps extends ButtonProps {
  label: string;
}

export const LabeledButton: React.FC<LabeledButtonProps> = ({
  label,
  children,
  disabled,
  ...props
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block"> {/* Wrapper to keep tooltip active */}
            <Button {...props} disabled={disabled}>
              {children}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
