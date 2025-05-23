export function formatDateToYMD(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; 
    return date.toISOString().slice(0, 10); 
  }
  
export function formatDateToDMY(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = (`0${date.getDate()}`).slice(-2);
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }