import { useEffect, useState } from "react";
import type { BriefTocItem } from "@/lib/private-runway-brief/briefDocumentTypes";
import { cn } from "@/lib/utils";

interface BriefTableOfContentsProps {
  items: BriefTocItem[];
  reportRootId?: string;
}

export function BriefTableOfContents({ items, reportRootId = "private-runway-brief-report" }: BriefTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const root = document.getElementById(reportRootId);
    if (!root) return;

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items, reportRootId]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <nav
      className="print:hidden"
      aria-label="Report contents"
      data-testid="brief-table-of-contents"
    >
      <p className="text-[10px] uppercase tracking-widest text-primary/70 font-semibold mb-3">Contents</p>
      <ol className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              className={cn(
                "w-full text-left rounded-lg px-3 py-2 text-xs transition-colors",
                activeId === item.id
                  ? "bg-primary text-white"
                  : "text-foreground/80 hover:bg-muted/80",
              )}
            >
              <span className="font-semibold mr-1.5">{item.number}.</span>
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Horizontal TOC for mobile */
export function BriefTableOfContentsMobile({ items }: BriefTableOfContentsProps) {
  return (
    <div className="lg:hidden print:hidden overflow-x-auto -mx-1 pb-2" data-testid="brief-toc-mobile">
      <div className="flex gap-2 min-w-max px-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 rounded-full border border-gold/25 bg-white px-3 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/5"
          >
            {item.number}. {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}
