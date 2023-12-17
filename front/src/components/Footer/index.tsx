import classes from "./styles.module.css";
import { FigmaLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.innerFooter}>
        <a
          href="https://github.com/Baoufa/espresso-donation-box"
          className={classes.link}
        >
          <GitHubLogoIcon />
          Source code
        </a>
        <a
          href="https://www.figma.com/file/6y4kGuFjPkm5dNPcMB4nt5/Benjamin-Anoufa---Espresso-Donation-Box?type=design&node-id=0%3A1&mode=design&t=FoDFVeQMUKhxUtf4-1"
          className={classes.link}
          target="_blank"
          rel="noreferrer"
        >
          <FigmaLogoIcon />
          Figma
        </a>
      </div>
    </footer>
  );
}
