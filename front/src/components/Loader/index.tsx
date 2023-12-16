import classes from "./styles.module.css";

interface LoaderProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Loader({ style, className }: LoaderProps) {
  return (
    <span className={`${classes.loader} ${className}`} style={style}>
      <span className={classes.dot} />
      <span className={classes.dot} />
      <span className={classes.dot} />
    </span>
  );
}
