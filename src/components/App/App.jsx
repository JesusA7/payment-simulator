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
import HelpIcon from "@mui/icons-material/Help";
import { addMonths } from "../../utils/format-date";
import History from "../History/History";
import jsPDF from "jspdf";

const initialData = { capital: "", tasa: "", periodo: "" };
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
  const handleShare = () => {
    if (navigator.share) {
      const doc = new jsPDF();
      doc.fromHTML(componentRef.current, 10, 10);

      const pdfDataUri = doc.output("datauristring");

      navigator
        .share({
          title: "Cronograma de pagos",
          text: "Es un cronograma de pagos detallado",
          url: pdfDataUri,
        })
        .then(() => {
          console.log("PDF compartido con éxito.");
        })
        .catch((error) => {
          console.error("Error al compartir el PDF: ", error);
        });
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
    TEM,
    cuota,
    intereses,
    deuda,
    fecha,
  }) => {
    setData({ capital, tasa, periodo });
    setResults({ cuota, intereses, deuda });
    let arr = [];
    let saldo = parseFloat(capital);
    let amortizacion;
    for (let i = 1; i <= periodo; i++) {
      saldo = i === 1 ? saldo : saldo - amortizacion;
      const interes = saldo * TEM;
      amortizacion = cuota - interes;
      const fecha = addMonths(new Date(), i);
      const arreglo = {
        nro: i,
        fecha,
        saldo,
        amortizacion,
        interes,
        cuota,
      };
      arr.push(arreglo);
    }
    setCron(arr);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { capital, periodo, tasa } = data;
    const TEM = convTasaToTEM({ tasa });
    const cuota = obtenerCuota(data);
    const intereses = cuota * periodo - capital;
    const deuda = cuota * periodo;
    setResults({ cuota, intereses, deuda });

    const itemHistory = {
      capital: parseInt(capital),
      periodo: parseInt(periodo),
      tasa: parseInt(tasa),
      TEM,
      cuota,
      intereses,
      deuda,
      fecha: new Date(),
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
      const fecha = addMonths(new Date(), i);
      const arreglo = {
        nro: i,
        fecha,
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
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <a href="#" style={{ display: "flex" }}>
          <img src="../../pago-en-linea.png" alt="icono simulador" width={64} />
          <p>Simulador de Cuotas</p>
        </a>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{ height: 20 }}
        />
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
        className="container__main"
      >
        <div>
          <h2>
            Simulador Cuotas
            <HelpIcon />
          </h2>
          <Form onSubmit={handleSubmit}>
            <Input
              title="Préstamo"
              name="capital"
              placeholder="Ingresa el capital"
              onChange={handleChange}
              value={data.capital}
              required
            />
            <Input
              title="Tasa"
              driverDescription="La tasa que debes ingresar es la Tasa Efectiva Anual (TEA)"
              name="tasa"
              placeholder="Ingresa la tasa efectiva anual"
              onChange={handleChange}
              step="0.01"
              max="100"
              min="0.01"
              value={data.tasa}
              required
            />
            <Input
              title="Nro. Periodos"
              name="periodo"
              placeholder="Ingresa el nro. de periodos"
              onChange={handleChange}
              value={data.periodo}
              max="360"
              min="1"
              step="1"
              required
            />
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
              <Button onClick={handlePrint}>Imprimir</Button>
              <Button onClick={handleShare}>Compartir</Button>
            </div>
          </Form>
        </div>
        <aside className="container__schedule" ref={componentRef}>
          <div className="container__card">
            <Card title={"Cuotas"} content={formatearNumero(results.cuota)} />
            <Card
              title={"Total Intereses"}
              content={formatearNumero(results.intereses)}
            />
            <Card
              title={"Total Deuda"}
              content={formatearNumero(results.deuda)}
            />
          </div>
          <div className="container__table">
            <DenseTableSchedule rows={cron} />
          </div>
        </aside>
      </main>
      {showHistory && (
        <History
          setItemHistory={handleClickItemHistory}
          history={history}
          setShowHistory={setShowHistory}
        />
      )}
      <footer>© Elaborado por Jesús Amable</footer>
    </>
  );
}

export default App;
