export function obtenerCuota({ capital, tasa, periodo }) {
  const TEM = convTasaToTEM({ tasa });
  return (
    (capital * (TEM * Math.pow(TEM + 1, periodo))) /
    (Math.pow(TEM + 1, periodo) - 1)
  );
}

export function convTasaToTEM({ tasa }) {
  return Math.pow(1 + tasa / 100, 1 / 12) - 1;
}
