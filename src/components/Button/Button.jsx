import Styles from "./Button.module.css";

export default function Button({ children, ...props }) {
  return (
    <button className={Styles.button} {...props}>
      {children}
    </button>
  );
}
