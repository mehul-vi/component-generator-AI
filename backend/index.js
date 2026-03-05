const express = require('express')
const app = express()
app.set('trust proxy', 1)

const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')

dotenv.config()

const connectDB = require('./config/db')

connectDB()


app.use(helmet())
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const authRoutes = require("./routes/auth")
app.use("/", authRoutes)

const historyRoutes = require("./routes/history")
app.use("/", historyRoutes)

const geminiRoutes = require("./routes/gemini")
app.use("/gemini", geminiRoutes)


app.get('/', (req, res) => {
  res.send('Backend Running')
})

app.get('/test', (req, res) => {
  res.json({ message: "Test route working" });
})


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  })
})


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const port = process.env.PORT || 3000

if (require.main === module) {
  app.listen(port, () => {
    console.log(` Server running on port ${port}`)
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`)
  })
}

module.exports = app;