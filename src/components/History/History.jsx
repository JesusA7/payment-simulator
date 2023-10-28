import Styles from "./History.module.css";
import { CardContent, Card } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
export default function History({
  history,
  setShowHistory,
  setItemHistory,
  deleteItemHistory,
}) {
  return (
    <div className={Styles.container__history}>
      <button onClick={() => setShowHistory(false)} style={{ height: 30 }} />
      <h4>Historial</h4>
      {history &&
        history.map((elem, index) => {
          const { id, capital, tasa, periodo, cuota } = elem;
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
              >
                <CardContent sx={{ padding: "1.5rem", width: "100%" }}>
                  <div style={{ display: "flex", width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: ".25rem",
                        alignItems: "start",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: ".8rem",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div>Capital:</div>
                        <div>{capital.toFixed(2)}</div>
                      </div>
                      <div
                        style={{
                          fontSize: ".8rem",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div>Tasa:</div> <div>{tasa.toFixed(2)}%</div>
                      </div>

                      <div
                        style={{
                          fontSize: ".8rem",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div>N° Periodos:</div>
                        <div>{periodo}</div>
                      </div>
                      <h5
                        style={{
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          borderTop: "1px solid #000",
                        }}
                      >
                        <div>Cuota:</div> <div>{cuota.toFixed(2)}</div>
                      </h5>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: ".5rem",
                    }}
                  >
                    <ArrowCircleLeftIcon
                      onClick={() => {
                        setItemHistory(elem);
                      }}
                    />
                    <DeleteIcon
                      onClick={() => {
                        deleteItemHistory({ id });
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          );
        })}
    </div>
  );
}
