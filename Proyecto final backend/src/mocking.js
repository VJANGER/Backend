function generateMockProducts(count = 100) {
    const mockProducts = [];
    for (let i = 1; i <= count; i++) {
      mockProducts.push({
        id: i,
        title: `Producto ${i}`,
        description: `Descripción del producto ${i}`,
        price: Math.floor(Math.random() * 100) + 1, 
      });
    }
    return mockProducts;
  }
  
  module.exports = {
    generateMockProducts,
  };
  