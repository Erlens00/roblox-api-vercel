const axios = require("axios");

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId es requerido." });
  }

  try {
    // Camisetas
    const shirts = await axios.get(
      `https://catalog.roblox.com/v1/search/items?category=Clothing&subcategory=Shirts&creatorTargetId=${userId}&limit=10`
    );

    // Juegos del usuario
    const games = await axios.get(
      `https://games.roblox.com/v2/users/${userId}/games?limit=10`
    );

    const gamepasses = [];

    for (const game of games.data.data) {
      const passes = await axios.get(
        `https://www.roblox.com/api/game-passes?placeId=${game.id}`
      );
      gamepasses.push(...passes.data);
    }

    res.status(200).json({
      shirts: shirts.data.data,
      gamepasses: gamepasses,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener datos.", details: err.message });
  }
}