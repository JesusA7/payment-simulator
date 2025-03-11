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
import ListItemText from "@mui/material/ListItemText";
import { OnlinePayment } from "../../svg/icon";
import { NoSearch } from "../../svg/image";
import { jsPDF as JsPDF } from "jspdf";
import { default as autoTable } from "jspdf-autotable";

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
    try {
      // Validar datos
      if (!data.capital || !data.tasa || !data.periodo) {
        console.log("Datos incompletos:", { data });
        alert("Por favor, completa todos los campos antes de generar el PDF.");
        return;
      }

      if (!cron || !Array.isArray(cron) || cron.length === 0) {
        console.log("Cronograma inválido:", { cron });
        alert("Por favor, genera primero el cronograma de pagos antes de compartir.");
        return;
      }

      if (!results || !results.intereses || !results.deuda) {
        console.log("Resultados inválidos:", { results });
        alert("Error: No se encontraron los resultados del cálculo.");
        return;
      }

      console.log("Iniciando generación de PDF con datos:", {
        capital: data.capital,
        tasa: data.tasa,
        periodo: data.periodo,
        filas: cron.length
      });

      // Crear documento PDF
      const doc = new JsPDF();
      console.log("Documento PDF creado");
      
      try {
        // Título
        doc.setFontSize(16);
        doc.text("Cronograma de Pagos", 105, 20, { align: 'center' });
        
        // Datos del préstamo
        doc.setFontSize(12);
        doc.text(`Capital: S/ ${formatearNumero(data.capital)}`, 20, 35);
        doc.text(`Tasa: ${data.tasa}%`, 20, 45);
        doc.text(`Periodo: ${data.periodo} meses`, 20, 55);
        console.log("Información básica agregada al PDF");

        // Preparar datos de tabla
        const tableData = cron.map((row, index) => {
          try {
            const fecha = new Date(row.fecha);
            return [
              row.nro,
              fecha instanceof Date && !isNaN(fecha) ? fecha.toLocaleDateString() : "-",
              formatearNumero(row.saldo),
              formatearNumero(row.amortizacion),
              formatearNumero(row.interes),
              formatearNumero(row.cuota)
            ];
          } catch (rowError) {
            console.error(`Error procesando fila ${index}:`, rowError);
            return [index + 1, "-", "-", "-", "-", "-"];
          }
        });
        console.log("Datos de tabla preparados:", { filas: tableData.length });

        // Generar tabla
        autoTable(doc, {
          startY: 65,
          head: [["N°", "Fecha", "Saldo", "Amort.", "Interés", "Cuota"]],
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          didDrawCell: (data) => {
            if (!data.cell.text || data.cell.text.length === 0) {
              console.warn(`Celda vacía detectada en fila ${data.row.index}, columna ${data.column.index}`);
            }
          }
        });
        console.log("Tabla generada exitosamente");

        // Totales
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Total Intereses: S/ ${formatearNumero(results.intereses)}`, 20, finalY);
        doc.text(`Total a Pagar: S/ ${formatearNumero(results.deuda)}`, 20, finalY + 10);
        console.log("Totales agregados al PDF");

      } catch (pdfError) {
        console.error("Error durante la generación del PDF:", pdfError);
        throw new Error("Error al generar el contenido del PDF");
      }

      // Generar blob
      console.log("Generando blob del PDF...");
      const pdfBlob = doc.output('blob');
      const pdfName = `cronograma_pagos_${Date.now()}.pdf`;
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const file = new File([new Uint8Array(arrayBuffer)], pdfName, { type: 'application/pdf' });
      console.log("Blob del PDF generado");

      // Intentar compartir
      if (navigator?.share && navigator.canShare) {
        console.log("Dispositivo soporta Web Share API");
        try {
          await navigator.share({
            files: [file],
            title: 'Cronograma de Pagos'
          });
        console.log("PDF compartido exitosamente");
            return;
        } catch (shareError) {
          if (shareError.name === 'AbortError') {
            console.log("Usuario canceló el compartir");
            return;
          }
          console.warn("Error al compartir, intentando descarga:", shareError);
        }
      } else {
        console.log("Dispositivo no soporta Web Share API, procediendo con descarga");
      }

      // Descargar
      saveAs(pdfBlob, pdfName);
      console.log("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error general en handleShare:", error);
      alert("No se pudo generar el PDF. Por favor, intente nuevamente.");
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
        Elaborado por Jesús Amable
      </footer>
    </>
  );
}

export default App;
