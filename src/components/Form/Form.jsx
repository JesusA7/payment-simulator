import Styles from "./Form.module.css";

export default function Form({ children, ...props }) {
  return (
    <form {...props} className={Styles.container__form}>
      {children}
    </form>
  );
}
