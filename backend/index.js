const express = require('express')
const app = express()
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
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))


const authRoutes = require("./routes/auth")
app.use("/api", authRoutes)

const historyRoutes = require("./routes/history")
app.use("/api", historyRoutes)

const geminiRoutes = require("./routes/gemini")
app.use("/api/gemini", geminiRoutes)


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
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(` Server running on port ${port}`)
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`)
  })
}

module.exports = app;