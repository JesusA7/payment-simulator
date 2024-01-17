export function addMonths(date, months) {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + months);
  console.log(months, date, newDate);
  if (date.getDate() !== newDate.getDate()) {
    newDate.setDate(0);
  }

  return formatDateToDDMMYYYY(newDate);
}
function formatDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function revertDate() {
  // Supongamos que tienes un objeto Date
  const dateObject = new Date();

  // Obtiene los componentes de la fecha (día, mes, año)
  const day = dateObject.getDate().toString().padStart(2, "0");
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // ¡Recuerda que los meses van de 0 a 11!
  const year = dateObject.getFullYear();

  // Formatea la fecha como YYYY-MM-DD (formato aceptado por input date)
  const formatDate = `${year}-${month}-${day}`;

  return formatDate;
}
