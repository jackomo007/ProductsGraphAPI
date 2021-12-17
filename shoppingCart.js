const fs = require("fs");

const getProductsCart = async () => {
  const result = await new Promise((resolve, reject) => {
    fs.readFile("./cart.json", "utf8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
  return JSON.parse(result).shoppingCart;
};

const addToCart = async (shoppingCart) => {
  await new Promise((resolve, reject) => {
    fs.writeFile(
      "./cart.json",
      JSON.stringify({ shoppingCart }, null, 2),
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

module.exports = {
  getProductsCart,
  addToCart,
};
