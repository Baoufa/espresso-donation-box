import classes from "./styles.module.css";
import { ChangeEvent } from "react";

interface InputProps {
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  userInput: string;
  disabled?: boolean;
  onUserInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  validate?: () => void;
}

export default function Input({
  placeholder,
  style,
  className,
  userInput,
  disabled,
  onUserInputChange,
  validate,
}: InputProps) {
  return (
    <div className={classes.container}>
      <input
        className={`${classes.input} ${className}`}
        style={style}
        placeholder={placeholder}
        value={userInput}
        onChange={onUserInputChange}
        data-has-value={Boolean(userInput)}
        onBlur={validate}
        disabled={Boolean(disabled)}
      />
      <div className={classes.currency}>ETH</div>
    </div>
  );
}
