export default {
  getFormattedDateTime: (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString();  
  }
};