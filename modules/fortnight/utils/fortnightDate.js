const getFortnightDates = () => {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0–11

  let currentFortnight;
  let previousFortnight;

  // --- Helper for formatting ---
  const format = (d) => {
    const monthStr = d.toLocaleString('en-US', { month: 'short' });
    const dateStr = String(d.getDate()).padStart(2, '0');
    const yearStr = d.getFullYear();
    return `${monthStr}${dateStr}${yearStr}`;
  };

  if (day <= 15) {
    // Current = last day of previous month
    currentFortnight = new Date(year, month, 0);

    // Previous = 15th of previous month
    previousFortnight = new Date(year, month - 1, 15);
  } else {
    // Current = 15th of current month
    currentFortnight = new Date(year, month, 15);

    // Previous = last day of previous month
    previousFortnight = new Date(year, month, 0);
  }

  return {
    current: format(currentFortnight),
    previous: format(previousFortnight)
  };
};

module.exports = { getFortnightDates };
