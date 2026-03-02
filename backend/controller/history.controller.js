const History = require("../models/history")

// ================= SAVE HISTORY =================
exports.saveHistory = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { prompt, framework, code } = req.body

    if (!prompt || !framework || !code) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    const newHistory = await History.create({
      userId,
      prompt,
      framework,
      code
    })

    res.status(201).json({
      success: true,
      message: "History saved successfully",
      data: newHistory
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}


// ================= GET USER HISTORY =================
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.auth.userId

    const history = await History.find({ userId })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}