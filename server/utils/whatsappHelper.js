exports.generateWhatsAppUrl = (phoneNumber, message) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
};
