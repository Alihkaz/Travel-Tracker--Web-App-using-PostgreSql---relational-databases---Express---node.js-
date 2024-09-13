// 

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
//creting a blue print from the installed package(pg) , and filling up credentials to send them later when we connect ! 
const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"word",
  password:"Your pg admin password",
  port:5432,
});
db.connect();


// 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));







app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries"); //resind codes in vc in word database
  let countries = []; //creating an empty array to send it later to ejs after filling it 
  result.rows.forEach((country) => { 
    countries.push(country.country_code);
  });
  //[{country_code:"GB"}] is the shape of the result that we get , the country ius the object
  // or each obejct in this array , then we are accessing every countriecode which is key in the
  // object , then pushing that code into contries array to send it over to ejs file 
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
 
});









// adding the data sended by the user to the database which we will read it then change the status of the map ! after checking the status of the input !
app.post("/add", async (req, res) => {

  const countryVisted=req.body["country"];


  //trying to see if the country exists in our database
  try{ 
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [countryVisted.toLowerCase()]); //adding the user country to our database
    // extracting the country code from the reslut we get , the result is an array of the form [{country_code:"GB"}], we 
    // are interested in the first object which is the first row , then accessing the country code key !  
    const data = result.rows[0];
    const countryCode = data.country_code;
  
  try{ //tryng then to see if the country code exists or not since its unique , after we checked if the country it self exists
    
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",
      [countryCode]); //adding the user country to our database
    res.redirect("/"); // redirecting to the home page with new data added to database
  }
  

  catch(err){ //if the country already exists in our database , then we return an error , even if its spelled correct or exists in general
    const result = await db.query("SELECT country_code FROM visited_countries"); //resind codes in vc in word database
    let countries = [];
    result.rows.forEach((country) => { 
      countries.push(country.country_code);
    }); 
    res.render("index.ejs", { countries: countries, total: countries.length ,error: "Country has already been added, try again.",});
   
  }




  }
  
  
  
  
  catch(err){ // if the country doesnot exist or there is a typo

  const result = await db.query("SELECT country_code FROM visited_countries"); //resind codes in vc in word database
  let countries = [];
  result.rows.forEach((country) => { countries.push(country.country_code);}); 
  res.render("index.ejs", { countries: countries, total: countries.length ,error: "Country name does not exist, try again.",});
 

  }
  
 
});






// listening on the local host 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
