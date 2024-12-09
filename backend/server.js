import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const port = process.env.PORT || 8080;
const app = express()
  
app.use(cors());
app.use(bodyParser.json());  

app.get("/", (req, res) => { res.send("hello world"); });

app.get("/users", (req, res) => { 
  res.json([
    {
      "id": "1",
      "firstname": "John",
      "secondname":"Admin",
      "email": "admin@example.com",
      "password": "admin",
      "role": "admin",
      "phone": "123-456-7890",
    },
    {
      "id": "2",
      "firstname": "Jane",
      "secondname":"Miles",
      "email": "jane@example.com",
      "password": "password123",
      "role": "co-worker",
      "phone": "987-654-3210",
    },
    {
      "id": "3",
      "firstname": "Mike",
      "secondname":"Worker",
      "email": "mike@example.com",
      "password": "password123",
      "role": "co-worker",
      "phone": "654-321-9870",
    },
  ]);
});

app.listen(port, () => console.log("App listening on port ${port}! Yay!"));
