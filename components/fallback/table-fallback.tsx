import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TableFallbackProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableFallback({
  rows = 5,
  columns = 4,
  className,
}: TableFallbackProps) {
  const mobileColumns = Math.max(2, Math.floor(columns / 2));

  return (
    <div className={cn("w-full rounded-md border", className)}>
      <div className="flex items-center border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className={cn(
              "flex-1 p-3 text-sm",
              i >= mobileColumns ? "hidden md:block" : "",
            )}
          >
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ))}
      </div>

    
      <div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex items-center last:border-b-0"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={cn(
                  "flex-1 p-3 text-sm",

                  colIndex >= mobileColumns ? "hidden md:block" : "",
                )}
              >
                <Skeleton className="h-4 w-[60%]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
