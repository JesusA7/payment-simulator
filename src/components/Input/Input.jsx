import Styles from "./Input.module.css";
import InfoIcon from "@mui/icons-material/Info";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";

const driverObj = driver();

console.log(Styles.container__input);
export default function Input({
  title,
  name,
  placeholder,
  driverTitle = title,
  driverDescription = "",
  aditionalContent = "",
  ...props
}) {
  useEffect(() => {}, []);

  const handleInfo = () => {
    driverObj.highlight({
      element: `input[name=${name}]`,
      popover: {
        title: `${driverTitle}`,
        description: `${driverDescription}`,
        side: "right",
        align: "center",
      },
    });
  };
  return (
    <div className={Styles.container__input}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".2rem",
        }}
      >
        <label htmlFor={name}>{title}</label>
        <InfoIcon
          style={{ marginTop: "4px", cursor: "pointer" }}
          fontSize="x-small"
          onClick={handleInfo}
        />
      </div>
      <input
        name={name}
        placeholder={placeholder}
        {...props}
        autoComplete="off"
      />
      {aditionalContent !== "" && (
        <span
          style={{
            position: "absolute",
            right: "0px",
            bottom: ".5rem",
            color: "rgba(0,0,0,.7)",
          }}
        >
          {aditionalContent}
        </span>
      )}
    </div>
  );
}
