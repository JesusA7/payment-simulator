export function formatearNumero(numero) {
  const partes = numero.toFixed(2).split(".");
  const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parteDecimal = partes[1];
  return `${parteEntera}.${parteDecimal}`;
}
