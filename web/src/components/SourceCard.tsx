import { FileText, Thermometer, ClipboardCheck, History, Wrench } from "lucide-react";
import { EvidenceDoc } from "@/types";

const TYPE_ICON: Record<EvidenceDoc["type"], React.ReactNode> = {
  Manual: <FileText size={13} />,
  Specification: <Thermometer size={13} />,
  "Service Report": <ClipboardCheck size={13} />,
  "Machine History": <History size={13} />,
  "Troubleshooting Guide": <Wrench size={13} />,
};

interface SourceCardProps {
  doc: EvidenceDoc;
  index: number;
}

export function SourceCard({ doc, index }: SourceCardProps) {
  return (
    <div className="tc-evidence-card" style={{ animationDelay: `${index * 90}ms` }}>
      <div className="tc-evidence-head">
        <span className="tc-evidence-type">
          {TYPE_ICON[doc.type]}
          {doc.type}
        </span>
        <span className="tc-evidence-machine">PUMP-A17</span>
      </div>
      <div className="tc-evidence-title">{doc.title}</div>
      <div className="tc-evidence-excerpt">&ldquo;{doc.excerpt}&rdquo;</div>
      {doc.date && <div className="tc-evidence-date">{doc.date}</div>}
    </div>
  );
}

export function SourceCardSkeleton() {
  return (
    <div className="tc-skeleton-wrap">
      {[0, 1, 2].map((i) => (
        <div className="tc-skeleton-card" key={i} style={{ animationDelay: `${i * 120}ms` }}>
          <div className="tc-skeleton-line tc-skeleton-line-sm" />
          <div className="tc-skeleton-line tc-skeleton-line-lg" />
          <div className="tc-skeleton-line tc-skeleton-line-md" />
        </div>
      ))}
    </div>
  );
}
