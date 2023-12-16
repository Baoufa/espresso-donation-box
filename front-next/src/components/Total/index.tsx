interface DonationPoolProps {
  toggleCurrency: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function DonationPool({ className, style }: DonationPoolProps) {
  return (
    <div
      className={className}
      style={{ height: 128, width: 343, background: "white" }}
    ></div>
  );
}
