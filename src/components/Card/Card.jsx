import Styles from "./Card.module.css";

export default function Card({ title, content }) {
  return (
    <div className={Styles.card}>
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  );
}
