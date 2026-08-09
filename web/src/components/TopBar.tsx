"use client";

import { GitBranch, History, RefreshCw } from "lucide-react";

interface TopBarProps {
  onOpenHistory: () => void;
  onReset: () => void;
}

export default function TopBar({ onOpenHistory, onReset }: TopBarProps) {
  return (
    <div className="tc-header">
      <div className="tc-brand">
        <span className="tc-brand-mark">TECHNICIAN COPILOT</span>
        <span className="tc-pill">PROTOTYPE</span>
      </div>
      <div className="tc-header-right">
        <button className="tc-icon-btn" onClick={onOpenHistory}>
          <History size={14} /> History
        </button>
        <button className="tc-icon-btn" onClick={onReset}>
          <RefreshCw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
