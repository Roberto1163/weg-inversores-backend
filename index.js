import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const PORT = 3000;

app.get("/inversores", async (req, res) => {
  try {
    const { data } = await axios.get("https://www.weg.net/catalog/weg/BR/pt/Drives");
    const $ = cheerio.load(data);

    const inversores = [];

    $(".product-card").each((_, el) => {
      const nome = $(el).find(".product-card__title").text().trim();
      const linkManual = $(el).find("a[href$='.pdf']").attr("href");
      const manual = linkManual ? `https://www.weg.net${linkManual}` : null;

      if (nome) {
        inversores.push({
          nome,
          manual,
          potencia: "N/A",
          tensao: "N/A",
          aplicacoes: []
        });
      }
    });

    res.json(inversores);
  } catch (error) {
    console.error("Erro ao buscar inversores:", error);
    res.status(500).json({ erro: "Falha ao obter dados da WEG" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
