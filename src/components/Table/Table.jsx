import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatearNumero } from "../../utils/format";

export default function DenseTableSchedule({ rows }) {
  return (
    <TableContainer component={Paper}>
      <Table
        stickyHeader
        size="small"
        aria-label="sticky table"
        sx={{ minWidth: 300 }}
      >
        <TableHead>
          <TableRow>
            <TableCell>N°</TableCell>
            <TableCell align="right">Vencimiento</TableCell>
            <TableCell align="right">Saldo</TableCell>
            <TableCell align="right">Amortización</TableCell>
            <TableCell align="right">Intereses</TableCell>
            <TableCell align="right">Seguro</TableCell>
            <TableCell align="right">Cuota</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              hover
              key={row.nro}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
              }}
            >
              <TableCell component="th" scope="row">
                {row.nro}
              </TableCell>
              <TableCell align="right">{row.fecha}</TableCell>
              <TableCell align="right">{formatearNumero(row.saldo)}</TableCell>
              <TableCell align="right">
                {formatearNumero(row.amortizacion)}
              </TableCell>
              <TableCell align="right">
                {formatearNumero(row.interes)}
              </TableCell>
              <TableCell align="right">
                {formatearNumero(row.interes)}
              </TableCell>
              <TableCell align="right">{formatearNumero(row.cuota)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
