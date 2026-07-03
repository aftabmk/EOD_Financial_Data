const getLastTradingDays = (current = new Date(), n = 5) => {
  const dates = [];
  let day = new Date(current);

  while (dates.length < n) {
    day.setDate(day.getDate() - 1);

    const weekday = day.getDay(); // 0 = Sunday, 6 = Saturday
    const dd = String(day.getDate()).padStart(2, "0");
    const mm = String(day.getMonth() + 1).padStart(2, "0");
    const yyyy = day.getFullYear();
    const formatted = `${dd}${mm}${yyyy}`;

    // Skip weekends and holidays
    if (weekday === 0 || weekday === 6 || holidays.includes(formatted)) continue;

    dates.push(formatted);
  }

  return dates.reverse();
}

const holidays = ["05112025","25122025"];

// 🧮 Example usage
// console.log({dates : getLastTradingDays(Date.now(), 5)});

module.exports = { getLastTradingDays };