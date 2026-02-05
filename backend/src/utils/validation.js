// validation.js - Функции для валидации данных

function validateEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function validateName(name) {
  return name && name.trim().length > 0 && name.length <= 50;
}

function validatePhone(phone) {
  if (!phone) return true;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

function validateAge(age) {
  if (!age) return true;
  return age >= 0 && age <= 150;
}

function validateProductData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Product name is required');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Product name cannot exceed 100 characters');
  }
  
  if (data.price === undefined || data.price === null) {
    errors.push('Price is required');
  }
  
  if (data.price && (data.price < 0 || isNaN(data.price))) {
    errors.push('Price must be a positive number');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateAge,
  validateProductData
};
