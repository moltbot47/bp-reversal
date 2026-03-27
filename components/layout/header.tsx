"use client";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1D2939]">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#667085]">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
