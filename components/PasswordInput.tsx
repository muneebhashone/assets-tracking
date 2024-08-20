"use client";

import { EyeClosedIcon } from "@radix-ui/react-icons";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
const PasswordInput = ({
  placeholder = "Enter your password...",

  ...field
}: PasswordInputProps) => {
  const [passwordVisisble, setPasswordVisible] = useState<boolean>(false);
  return (
    <div className="relative">
      {passwordVisisble ? (
        <EyeClosedIcon
          className="absolute right-4 top-2 w-5 h-5 cursor-pointer hover:text-golden"
          onClick={() => setPasswordVisible((prev) => !prev)}
        />
      ) : (
        <Eye
          className="absolute right-4 top-2 w-5 h-5 cursor-pointer hover:text-golden"
          onClick={() => setPasswordVisible((prev) => !prev)}
        />
      )}
      <Input
        type={passwordVisisble ? "text" : "password"}
        placeholder={placeholder}
        {...field}
      />
    </div>
  );
};

export default PasswordInput;
