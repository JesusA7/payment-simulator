import "./App.css";
import Form from "../Form/Form";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { obtenerCuota, convTasaToTEM } from "../../utils/calculate";
import { useState, useRef, useEffect } from "react";
import Card from "../Card/Card";
import DenseTableSchedule from "../Table/Table";
import { useReactToPrint } from "react-to-print";
import { formatearNumero } from "../../utils/format";
import { addMonths, revertDate } from "../../utils/format-date";
import History from "../History/History";
import { saveAs } from "file-saver"; // Para la descarga del PDF
import HelpIcon from "@mui/icons-material/Help";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import HistoryIcon from "@mui/icons-material/History";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { OnlinePayment } from "../../svg/icon";
import { NoSearch } from "../../svg/image";
const initialData = {
  capital: "",
  tasa: "",
  periodo: "",
  fecha: revertDate(new Date()),
};
const initialResults = { cuota: 0, intereses: 0, deuda: 0 };

function App() {
  const [data, setData] = useState(initialData);
  const [results, setResults] = useState(initialResults);
  const [cron, setCron] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const componentRef = useRef();
  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("data")) || []);
  }, []);
  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: e.target.value };
    setData(newData);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleShare = async () => {
    // Generar un nombre único para el PDF
    const pdfName = `contenido_imprimible_${new Date().getTime()}.pdf`;

    // Descargar el PDF utilizando FileSaver.js (puedes utilizar otras bibliotecas)
    const blob = new Blob([], { type: "application/pdf" });
    saveAs(blob, pdfName);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cronograma de pagos",
          text: "Es un cronograma de pagos detallado",
          files: [new File([blob], pdfName)],
        });
        console.log("PDF compartido con éxito.");
      } catch (error) {
        console.error("Error al compartir el PDF: ", error);
      }
    } else {
      console.log(
        "La función de compartir no está disponible en este navegador."
      );
    }
  };
  const handleClickItemHistory = ({
    capital,
    periodo,
    tasa,
    fecha,
    TEM,
    cuota,
    intereses,
    deuda,
  }) => {
    setData({ capital, tasa, periodo, fecha });
    setResults({ cuota, intereses, deuda });
    let arr = [];
    let saldo = parseFloat(capital);
    let amortizacion;
    for (let i = 1; i <= periodo; i++) {
      saldo = i === 1 ? saldo : saldo - amortizacion;
      const interes = saldo * TEM;
      amortizacion = cuota - interes;
      const fechaSiguiente = addMonths(new Date(fecha + "T00:00:00"), i);
      const arreglo = {
        nro: i,
        fecha: fechaSiguiente,
        saldo,
        amortizacion,
        interes,
        cuota,
      };
      arr.push(arreglo);
    }
    setCron(arr);
  };
  const handleDeleteItemHistory = ({ id }) => {
    const newHistory = history.filter((value) => value.id !== id);
    setHistory(newHistory);
    localStorage.setItem("data", JSON.stringify(newHistory));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { capital, periodo, tasa, fecha } = data;
    const TEM = convTasaToTEM({ tasa });
    const cuota = obtenerCuota(data);
    const intereses = cuota * periodo - capital;
    const deuda = cuota * periodo;
    setResults({ cuota, intereses, deuda });

    const itemHistory = {
      id: globalThis.crypto.randomUUID(),
      capital: parseFloat(capital),
      periodo: parseFloat(periodo),
      tasa: parseFloat(tasa),
      TEM,
      cuota,
      intereses,
      deuda,
      fecha,
    };
    const newHistory = [...history, itemHistory];
    setHistory(newHistory);
    localStorage.setItem("data", JSON.stringify(newHistory));

    let arr = [];
    let saldo = parseFloat(capital);
    let amortizacion;
    for (let i = 1; i <= periodo; i++) {
      saldo = i === 1 ? saldo : saldo - amortizacion;
      const interes = saldo * TEM;
      amortizacion = cuota - interes;
      const fechaSiguiente = addMonths(new Date(fecha + "T00:00:00"), i);
      const arreglo = {
        nro: i,
        fecha: fechaSiguiente,
        saldo,
        amortizacion,
        interes,
        cuota,
      };
      arr.push(arreglo);
    }
    setCron(arr);
  };
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <a
          href="#"
          style={{ display: "flex", textDecoration: "none", color: "#1a73e8" }}
        >
          <OnlinePayment />
        </a>
        <button
          style={{
            cursor: "pointer",
            border: "none",
            padding: "0px",
            backgroundColor: "transparent",
          }}
          onClick={() => setShowHistory(!showHistory)}
        >
          <HistoryIcon />
        </button>
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
        className="container__main"
      >
        <div className="container__form">
          <h2>
            Simulador Cuotas
            <HelpIcon />
          </h2>
          <Form onSubmit={handleSubmit}>
            <Input
              title="Préstamo Solicitado"
              name="capital"
              type="number"
              placeholder="Ingresa el capital"
              onChange={handleChange}
              value={data.capital}
              step="0.01"
              required
            />
            <Input
              title="Tasa Efectiva Anual (%)"
              driverDescription="La tasa que debes ingresar es la Tasa Efectiva Anual (TEA)"
              name="tasa"
              type="number"
              placeholder="Ingresa la tasa efectiva anual"
              onChange={handleChange}
              step="0.01"
              max="300"
              min="0.01"
              value={data.tasa}
              required
              aditionalContent={
                data.tasa && `TEM: ${(convTasaToTEM(data) * 100).toFixed(2)}%`
              }
            />
            <Input
              title="Nro. Periodos (meses)"
              name="periodo"
              type="number"
              placeholder="Ingresa el nro. de periodos"
              onChange={handleChange}
              value={data.periodo}
              max="360"
              min="1"
              step="1"
              required
            />
            <Input
              title="Fecha Inicio"
              name="fecha"
              type="date"
              placeholder="Ingresa la fecha de inicio del préstamo"
              onChange={handleChange}
              value={data.fecha}
              step="0.01"
              required
            />
            <div className="container__button">
              <Button>Simular</Button>
              <Button
                type="button"
                onClick={() => {
                  setData(initialData);
                  setResults(initialResults);
                  setCron([]);
                }}
              >
                Limpiar
              </Button>
            </div>
          </Form>
        </div>
        <aside className="container__schedule" ref={componentRef}>
          {cron.length !== 0 ? (
            <>
              <div
                className="container__details"
                style={{ display: "flex", width: "100%" }}
              >
                <div style={{ flex: 1 }}>
                  <List component="nav" aria-label="main mailbox folders" dense>
                    <ListItem>
                      <ListItemText
                        primary="Préstamo solicitado"
                        secondary={formatearNumero(parseFloat(data.capital))}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tasa Efectiva Anual"
                        secondary={formatearNumero(parseFloat(data.tasa)) + "%"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Nro. Periodo en meses"
                        secondary={formatearNumero(parseInt(data.periodo))}
                      />
                    </ListItem>
                  </List>
                </div>
                <div style={{ flex: 1 }}>
                  <List component="nav" aria-label="main mailbox folders" dense>
                    <ListItem>
                      <ListItemText
                        primary="Cuota"
                        secondary={formatearNumero(results.cuota)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Intereses"
                        secondary={formatearNumero(results.intereses)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Deuda"
                        secondary={formatearNumero(results.deuda)}
                      />
                    </ListItem>
                  </List>
                </div>
              </div>
              <div className="container__table">
                <DenseTableSchedule rows={cron} />
              </div>
            </>
          ) : (
            <div style={{ display: "grid", placeContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <NoSearch />
              </div>
              <span
                style={{
                  display: "block",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Ninguna simulación ha sido calculada
              </span>
            </div>
          )}

          <div className="container__button">
            <Button className="print-hide" onClick={handlePrint}>
              <PrintIcon />
            </Button>
            <Button className="print-hide" onClick={handleShare}>
              <ShareIcon />
            </Button>
          </div>
        </aside>
      </main>
      {showHistory && (
        <History
          setItemHistory={handleClickItemHistory}
          history={history}
          setShowHistory={setShowHistory}
          deleteItemHistory={handleDeleteItemHistory}
        />
      )}
      <footer
        style={{
          padding: "2rem 0",
          fontSize: "1rem",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        © Elaborado por Jesús Amable
      </footer>
    </>
  );
}

export default App;
