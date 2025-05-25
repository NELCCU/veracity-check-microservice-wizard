
// Expresiones regulares para validación
export const PHONE_REGEX = /^\+[1-9]\d{1,14}$/; // E.164 format
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // RFC 5322
export const URL_REGEX = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;

export const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone) {
    return { isValid: false, message: 'El número de teléfono es requerido' };
  }
  
  if (!PHONE_REGEX.test(phone)) {
    return { 
      isValid: false, 
      message: 'Formato inválido. Use formato E.164 (ej: +1234567890)' 
    };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'El correo electrónico es requerido' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { 
      isValid: false, 
      message: 'Formato de correo electrónico inválido' 
    };
  }
  
  return { isValid: true };
};

export const validateUrl = (url: string): { isValid: boolean; message?: string } => {
  if (!url) {
    return { isValid: false, message: 'La URL es requerida' };
  }
  
  if (!URL_REGEX.test(url)) {
    return { 
      isValid: false, 
      message: 'Formato de URL inválido. Debe incluir http:// o https://' 
    };
  }
  
  return { isValid: true };
};

export const formatPhone = (phone: string): string => {
  // Remover espacios y caracteres especiales excepto +
  return phone.replace(/[^\d+]/g, '');
};

export const formatEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const formatUrl = (url: string): string => {
  let formattedUrl = url.trim().toLowerCase();
  
  // Agregar protocolo si no existe
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }
  
  return formattedUrl;
};
