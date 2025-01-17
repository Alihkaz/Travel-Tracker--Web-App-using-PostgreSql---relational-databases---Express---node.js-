// 

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db =pg.Client({ 
  user:"postgres",
  host:"localhost",
  database:"word",
  password:"your pg admin password",
  port:5432,
});
db.connect();





app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));







app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries"); 
  let countries = []; 
  result.rows.forEach((country) => { 
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  db.end();
});









// adding the data sended by the user to the database which we will read it then change the status of the map ! 
app.post("/add", async (req, res) => {

countryVisted=req.body.country;

try{ 
const result = await db.query("SELECT country_code FROM countries WHERE country_name=$1",[countryVisted]); 

const data = result.rows[0];
const countryCode = data.country_code;

    try{await db.query("INSERT INTO visited_countries (country_code) VALUES (1$)",[countryCode]); 
        res.redirect("/");}

    catch(err){ 
        const result = await db.query("SELECT country_code FROM visited_countries"); 
        let countries = [];
        result.rows.forEach((country) => {countries.push(country.country_code);}); 
        res.render("index.ejs", { countries: countries, total: countries.length ,error: "Country has already been added, try again.",}); 
        }}
  
  
        

catch(err){ 
const result = await db.query("SELECT country_code FROM visited_countries");
let countries = [];
result.rows.forEach((country) => { countries.push(country.country_code);}); 
res.render("index.ejs", { countries: countries, total: countries.length ,error: "Country name does not exist, try again.",});

}

 
});






// listening on the local host 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
