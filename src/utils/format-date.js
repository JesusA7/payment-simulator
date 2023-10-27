export function addMonths(date, months) {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + months);
  // console.log(date, newDate);
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
