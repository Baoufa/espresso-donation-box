import classes from "./styles.module.css";

interface TitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Title({ children, style, className }: TitleProps) {
  return (
    <h1 className={`${classes.title} ${className}`} style={style}>
      {children}
    </h1>
  );
}
