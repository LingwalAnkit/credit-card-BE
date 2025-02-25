const CreditCard = require("../models/cardModel");
const {
  generateRandomCard,
  generateExpiry,
  generateCVV,
} = require("../utils/generator");
const { encrypt, decrypt } = require("../utils/crypto");

exports.createCreditCard = async (req, res) => {
  try {
    const { cardType } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!["visa", "mastercard", "amex"].includes(cardType)) {
      return res.status(400).json({ message: "Invalid card type" });
    }

    const cardNumber = generateRandomCard(cardType);
    const expiryDate = generateExpiry();
    const cvv = generateCVV(cardType);

    // Encrypt sensitive data before storing
    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCVV = encrypt(cvv);

    const creditCard = new CreditCard({
      userId,
      cardNumber: encryptedCardNumber, // Store encrypted value
      cardType,
      expiryDate,
      cvv: encryptedCVV, // Store encrypted value
    });

    await creditCard.save();

    // Return unencrypted values in the response
    res.status(201).json({
      message: "Credit card generated successfully",
      card: {
        cardNumber, // Return original value
        cardType,
        expiryDate,
        cvv, // Return original value
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating credit card", error: error.message });
  }
};

exports.getCreditCards = async (req, res) => {
  try {
    const userId = req.user.id;
    const encryptedCards = await CreditCard.find({ userId });
    
    // Decrypt sensitive data for the response
    const cards = encryptedCards.map(card => {
      const decryptedCard = card.toObject();
      // Decrypt the sensitive fields
      decryptedCard.cardNumber = decrypt(card.cardNumber);
      decryptedCard.cvv = decrypt(card.cvv);
      return decryptedCard;
    });
    
    res.json({ cards });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching credit cards", error: error.message });
  }
};