import classes from "./styles.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function Button({
  children,
  disabled,
  style,
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${classes.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
