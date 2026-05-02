import { BookOpenCheck } from "lucide-react";

const RuleBox = ({ title = "Kural Kartı", children, accentColor = "#C44900" }) => {
  return (
    <div
      className="recipe-card rounded-md p-6 md:p-8 relative overflow-hidden animate-scale-in shadow-[4px_4px_0_rgba(214,140,69,0.5)] border border-[#E8DCC4]"
      data-testid="rule-box"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="p-2 rounded-md"
          style={{ background: `${accentColor}15`, color: accentColor }}
        >
          <BookOpenCheck size={20} />
        </div>
        <span
          className="font-serif-display text-xs tracking-[0.25em] uppercase"
          style={{ color: accentColor }}
        >
          {title}
        </span>
      </div>
      <p className="font-body text-base md:text-lg leading-relaxed text-[#2A2421]">
        {children}
      </p>
    </div>
  );
};

export default RuleBox;
