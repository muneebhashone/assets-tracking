import { Button } from "@/components/ui/button";
import { useRetrySync } from "@/services/monitoring.mutations";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface RetrySyncButtonProps {
	shipmentId: number;
	size?: "sm" | "default" | "lg";
	variant?: "default" | "outline" | "ghost";
	disabled?: boolean;
	showText?: boolean;
}

export function RetrySyncButton({
	shipmentId,
	size = "sm",
	variant = "outline",
	disabled = false,
	showText = true,
}: RetrySyncButtonProps) {
	const [isRetrying, setIsRetrying] = useState(false);
	const { toast } = useToast();

	const { mutate: retrySync } = useRetrySync({
		onSuccess: (data) => {
			setIsRetrying(false);
			toast({
				title: "Success",
				description: data.data.message || "Sync retry initiated successfully",
			});
		},
		onError: (error) => {
			setIsRetrying(false);
			toast({
				title: "Error",
				description: error.message || "Failed to retry sync",
				variant: "destructive",
			});
		},
	});

	const handleRetry = () => {
		setIsRetrying(true);
		retrySync({ id: shipmentId });
	};

	return (
		<Button
			size={size}
			variant={variant}
			onClick={handleRetry}
			disabled={disabled || isRetrying}
			className="flex items-center gap-1"
		>
			<RefreshCw className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
			{showText && <span>{isRetrying ? "Retrying..." : "Retry Sync"}</span>}
		</Button>
	);
}