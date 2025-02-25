function generateLuhnNumber(partial) {
  let sum = 0;
  let isEven = false;

  // Calculate Luhn sum
  for (let i = partial.length - 1; i >= 0; i--) {
    let digit = parseInt(partial[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  // Calculate check digit
  const checkDigit = (10 - (sum % 10)) % 10;
  return partial + checkDigit;
}

function generateRandomCard(type) {
  const prefixes = {
    visa: ["4"],
    mastercard: ["51", "52", "53", "54", "55"],
    amex: ["34", "37"],
  };

  const lengths = {
    visa: 16,
    mastercard: 16,
    amex: 15,
  };

  // Get random prefix for card type
  const prefix =
    prefixes[type][Math.floor(Math.random() * prefixes[type].length)];
  const length = lengths[type];

  // Generate random numbers for remaining digits
  let partial = prefix;
  while (partial.length < length - 1) {
    partial += Math.floor(Math.random() * 10);
  }

  return generateLuhnNumber(partial);
}

function generateExpiry() {
  const now = new Date();
  const year = now.getFullYear() + Math.floor(Math.random() * 5) + 1;
  const month = Math.floor(Math.random() * 12) + 1;
  return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
}

function generateCVV(type) {
  const length = type === "amex" ? 4 : 3;
  let cvv = "";
  for (let i = 0; i < length; i++) {
    cvv += Math.floor(Math.random() * 10);
  }
  return cvv;
}

module.exports = {
  generateRandomCard,
  generateExpiry,
  generateCVV,
};
