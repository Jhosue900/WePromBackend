const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const router = require("./src/routes/routes")

const app = express();

app.set("port", process.env.PORT || 4000);

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use(router)

app.listen(app.get("port"))
console.log("Server running on port ", app.get("port"))