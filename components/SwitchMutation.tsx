import React from "react";
import { Switch } from "./ui/switch";
interface SwitchMutationProps {
  switchState: boolean;
  mutationFn: () => void;
}
const SwitchMutation = ({ switchState, mutationFn }: SwitchMutationProps) => {
  return <Switch onCheckedChange={mutationFn} checked={switchState} />;
};

export default SwitchMutation;
