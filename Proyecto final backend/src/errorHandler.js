const errorDictionary = {
    PRODUCT_NOT_FOUND: 'Producto no encontrado',
    INVALID_PRODUCT_DATA: 'Datos de producto no válidos',
    CART_ITEM_NOT_FOUND: 'Producto en el carrito no encontrado',
  };
  
  function handleCustomError(errorCode) {
    const errorMessage = errorDictionary[errorCode] || 'Error desconocido';
    const error = new Error(errorMessage);
    error.code = errorCode;
    return error;
  }
  
  module.exports = {
    handleCustomError,
  };
  