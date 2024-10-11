import React from "react";
import { Switch } from "./ui/switch";
interface SwitchMutationProps {
  switchState: boolean;
  mutationFn: () => void;
  disabled?: boolean;
}
const SwitchMutation = ({
  switchState,
  mutationFn,
  disabled,
}: SwitchMutationProps) => {
  return (
    <Switch
      className="data-[state=checked]:bg-green-500"
      onCheckedChange={mutationFn}
      checked={switchState}
      disabled={disabled}
    />
  );
};

export default SwitchMutation;
