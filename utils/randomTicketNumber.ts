export function generateRandomTicketNumber(): string {
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `TC${String(randomNum).padStart(4, '0')}`;
}
