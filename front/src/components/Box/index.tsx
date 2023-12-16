import classes from "./styles.module.css";

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return <div className={classes.box}>{children}</div>;
}
