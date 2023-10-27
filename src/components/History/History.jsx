import Styles from "./History.module.css";
import { CardContent, Card } from "@mui/material";
export default function History({ history, setShowHistory, setItemHistory }) {
  return (
    <div className={Styles.container__history}>
      <button onClick={() => setShowHistory(false)} style={{ height: 30 }} />
      Historial
      {history &&
        history.map((elem, index) => {
          const { capital, tasa, periodo, intereses, deuda, cuota, fecha } =
            elem;
          return (
            <>
              <Card
                key={index}
                sx={{
                  display: "flex",
                  width: "80%",
                  cursor: "pointer",
                  margin: "auto",
                  marginBottom: "1rem",
                }}
                onClick={() => {
                  setItemHistory(elem);
                }}
              >
                <CardContent>
                  <div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <h5 style={{ margin: "0" }}>Capital: {capital}</h5>
                      <p style={{ fontSize: ".8rem", margin: "0" }}>
                        Tasa: {tasa}
                      </p>
                      <p style={{ fontSize: ".8rem", margin: "0" }}>
                        Nro. Periodo: {periodo}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <h5 style={{ margin: "0" }}>Cuota: {cuota.toFixed(2)}</h5>
                      <p style={{ fontSize: ".8rem", margin: "0" }}>
                        Intereses: {intereses.toFixed(2)}
                      </p>
                      <p style={{ fontSize: ".8rem", margin: "0" }}>
                        Total: {deuda.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          );
        })}
    </div>
  );
}
