const fs = require("fs");

const getFavorites = async () => {
  const result = await new Promise((resolve, reject) => {
    fs.readFile("./data.json", "utf8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
  return JSON.parse(result).favorites;
};

const setFavorites = async (favorites) => {
  await new Promise((resolve, reject) => {
    fs.writeFile(
      "./data.json",
      JSON.stringify({ favorites }, null, 2),
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
  getFavorites,
  setFavorites,
};
