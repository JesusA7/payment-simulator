import Styles from "./Button.module.css";

export default function Button({ children, hidePrint, ...props }) {
  return (
    <button className={Styles.button} {...props}>
      {children}
    </button>
  );
}
