interface BadgeProps {
  label: string;
  color: string;
  small?: boolean;
}

export function Badge({ label, color, small }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"
      }`}
      style={{
        backgroundColor: `${color}15`,
        color,
      }}
    >
      {label}
    </span>
  );
}
