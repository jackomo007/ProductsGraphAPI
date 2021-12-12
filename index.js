const cors = require("micro-cors")();
const { ApolloServer, gql } = require("apollo-server-micro");
const { send } = require("micro");
const { nanoid } = require("nanoid");
const { getFavorites, setFavorites } = require("./favorites");

const wait = (numMs) => new Promise((res) => setTimeout(() => res(), numMs));

const products = [
  {
    id: "y7nqO9KWVH6SfQ6RMlPKg",
    name: "AMP12™ BACKPACK 25L",
    image:
      "https://www.511tactical.com/media/catalog/product/5/6/56392_014_01_v3.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=300&width=300",
    description:
      "Set your course and move out - the AMP12™ backpack is built for durability, flexibility and comfort. Compact and efficient, it features 5.11's innovative HEXGRID® load bearing system, which offers unprecedented options for mounting or attaching gear.",
    price: "$150.00",
  },
  {
    id: "1n4n7KZYT3MDjkXYmvtEL",
    name: "5.11 STRYKE® PANT",
    image:
      "https://www.511tactical.com/media/catalog/product/74369/055/74369_055_01v4.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=300&width=300",
    description:
      "The 5.11 Stryke® Pant is what all other pants want to be. Made of our patent-pending two-way Flex-Tac® mechanical stretch fabric, finished with stain- and soil-resistant Teflon®, the 5.11 Stryke® pant is exceptionally durable.",
    price: "$80.00",
  },
  {
    id: "uT2cyPQK9kpKiNkCQ7QEc",
    name: "ELITE LONG SLEEVE POCKET TEE",
    image: "https://www.511tactical.com/media/catalog/product/4/2/42020_186_elitelstee_01_2.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=300&width=300",
    description: "Throw on these 5.11® Tees and wrap yourself in 100% cotton jersey with breathable performance. And with inks that resist the threats of fading from the sun and time, you'll have comfort, fit, and looks that last.",
    price: "$35.00",
  },
  {
    id: "JsjU2i9KcsN8Kwdn6ZOE4",
    name: "SIGNATURE DUTY JACKET",
    image: "https://www.511tactical.com/media/catalog/product/4/8/48103_019_01v_7.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=300&width=300",
    description: "With a zip-out quilted liner, a roll-up/removable hood, and waterproof/breathable construction, the Signature Duty Jacket provides complete and modular weather protection ideally suited to a broad range of patrol climates.",
    price: "$210.00",
  },
  {
    id: "6JymTLsCFLzIOO_4aXyc0",
    name: "SPEED 3.0 WATERPROOF SIDE ZIP BOOT",
    image: "https://www.511tactical.com/media/catalog/product/12371/019/12371_019_01.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=300&width=300",
    description: "For the most demanding parts of your job, this boot backs you. The new Speed 3.0 Jungle platform outsole gives you stickier multi-surface traction.",
    price: "$140.00",
  },
  {
    id: "6JymTLsCFLzIOO_4aXyc0",
    name: "SPEED 3.0 WATERPROOF SIDE ZIP BOOT",
    image: "https://www.511tactical.com/media/catalog/product/12371/019/12371_019_01.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=300&width=300",
    description: "For the most demanding parts of your job, this boot backs you. The new Speed 3.0 Jungle platform outsole gives you stickier multi-surface traction.",
    price: "$140.00",
  },
];

const typeDefs = gql`
  type Product {
    id: ID!
    name: String
    image: String!
    description: String
    price: String!
    favoriteId: ID
  }
  type Favorite {
    id: ID!
    product: Product!
  }

  type Query {
    products: [Product!]
    product(id: ID!): Product
    favorites: [Favorite!]
  }

  type Mutation {
    addFavorite(productId: ID!): Favorite
    removeFavorite(favoriteId: ID!): Boolean
  }
`;

const resolvers = {
  Product: {
    favoriteId: async (parent) => {
      const favorites = await getFavorites();
      const favorite = favorites.find((b) => b.product.id === parent.id);
      return favorite ? favorite.id : null;
    },
  },
  Query: {
    async products() {
      await wait(1000);
      return products;
    },
    async favorites() {
      await wait(1000);
      const favorites = await getFavorites();
      return favorites;
    },
    async product(parent, args) {
      await wait(1000);
      const product = products.find((s) => s.id === args.id);
      return product || null;
    },
  },
  Mutation: {
    async addFavorite(parent, args) {
      await wait(1000);
      const favorites = await getFavorites();
      if (!favorites.find((favorite) => favorite.product.id === args.productId)) {
        const productToAdd = products.find(
          (product) => product.id === args.productId
        );
        if (productToAdd) {
          const favorite = { id: nanoid(), product: productToAdd };
          setFavorites([...favorites, favorite]);
          return favorite;
        }
      }
      return null;
    },
    async removeFavorite(parent, args) {
      await wait(1000);
      const favorites = await getFavorites();
      const favoriteToRemove = favorites.find(
        (favorite) => favorite.id === args.favoriteId
      );

      if (favoriteToRemove) {
        const storeFavorites = await getFavorites();
        const newFavorites = storeFavorites.filter(
          (b) => b.id !== args.favoriteId
        );
        setFavorites(newFavorites);
        return true;
      }

      return false;
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

module.exports = apolloServer.start().then(() => {
  const handler = apolloServer.createHandler();
  return cors((req, res) =>
    req.method === "OPTIONS" ? send(res, 200, "ok") : handler(req, res)
  );
});
