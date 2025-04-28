const express = require("express");
const Product = require("./models/Product");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const PORT = 3000;
const bodyParser = require("body-parser");

// Configurazione body-parser per gestire i dati del body delle richieste
app.use(bodyParser.urlencoded({ extended: true }));

// Configurazione EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Configurazione method-override per le richieste POST, PUT e DELETE dai forms in HTML
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Configurazione dei file statici
app.use(express.static(path.join(__dirname, "public")));

// Connessione a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/e-commerce-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connesso al database"))
  .catch((err) => console.error("Impossibile connettersi al database", err));

// Definizione degli endpoints
app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

// INDEX - Lista di tutti i prodotti
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});

// NEW - Mostra il form per creare un nuovo prodotto
app.get("/products/new", (req, res) => {
  res.render("products/new");
});

// CREATE - Crea un nuovo prodotto
app.post("/products/new", async (req, res) => {
  const { nome, prezzo, descrizione } = req.body;

  const product = new Product({
    nome,
    prezzo,
    descrizione,
  });

  await product.save();

  res.redirect("/products");
});

// UPDATE - Visualizza il form per modificare un prodotto
app.get("/products/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/edit", { product: product });
});

// UPDATE - Processa la richiesta di modifica di un prodotto
app.put("/products/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/products");
});

// DELETE - Elimina un prodotto
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});

// SHOW - Visualizza i dettagli di un singolo prodotto
app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/show", { product });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
