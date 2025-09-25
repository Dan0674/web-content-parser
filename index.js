import express from 'express';
import Mercury from '@postlight/mercury-parser';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.get('/parser', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL manquante' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const result = await Mercury.parse(url, { html });

    res.json({
      titre: result.title,
      contenu: result.content ? result.content.replace(/<[^>]*>/g, '') : '',
      url: result.url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'extraction du contenu" });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur lancé sur le port ${port}`);
});
