/* eslint-disable react/prop-types */
import Styles from "./History.module.css";
import { CardContent, Card } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import LogoutIcon from '@mui/icons-material/Logout';
export default function History({
  history,
  setShowHistory,
  setItemHistory,
  deleteItemHistory,
}) {
  
  return (
    <div className={Styles.container__history}>
      <div style={{display:'flex', justifyContent:'center', position:'relative', padding:'1.5rem 0'}}>
        <button onClick={() => setShowHistory(false)} style={{ height: '1.5rem', background:'transparent', border:'none', position:'absolute', left:'16px', cursor:'pointer'}} ><LogoutIcon color="info" sx={{height:'1.5rem'}}/></button>
      <h4 style={{padding:'0px', margin:'0px', fontSize:'1.25rem'}}>Historial</h4>
      </div>
      {
      history &&
        [...history].reverse().map((elem, index) => {
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
                        setShowHistory(false);
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
