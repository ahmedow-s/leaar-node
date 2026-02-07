// ============ VALIDATION UTILITIES ============

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate name
const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

// Validate phone (basic)
const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  return phone.length >= 10;
};

// Validate age
const isValidAge = (age) => {
  if (!age) return true; // Optional field
  return age >= 13 && age <= 120;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPhone,
  isValidAge
};
