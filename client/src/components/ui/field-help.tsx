import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FieldHelpProps {
  text: string;
  className?: string;
}

/** Tooltip on desktop; tap-to-open popover on mobile (hover tooltips don't work on touch). */
export function FieldHelp({ text, className = "" }: FieldHelpProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`inline-flex p-0.5 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
            aria-label="More information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="max-w-xs text-xs leading-relaxed" side="top" align="start">
          {text}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex p-0.5 rounded-full text-muted-foreground cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
          aria-label="More information"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
    </Tooltip>
  );
}
