const geminiService = require("../services/gemini.service");
const History = require("../models/history");

// ================= GENERATE CODE =================
exports.generateCode = async (req, res) => {
  try {
    const { prompt, framework } = req.body;
    const userId = req.auth?.userId || "guest"; // Fallback for unauthenticated users

    // 1️⃣ Validation
    if (!prompt || !framework) {
      return res.status(400).json({
        success: false,
        message: "Prompt and framework are required"
      });
    }

    // 2️⃣ Call Gemini API
    const result = await geminiService.generateCode(prompt, framework);

    if (!result.success) {
      console.error("Gemini API failed:", result.error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate code",
        error: result.error
      });
    }

    // 3️⃣ Save to history (if authenticated)
    if (userId !== "guest") {
      try {
        await History.create({
          userId,
          prompt,
          framework,
          code: result.code
        });
      } catch (historyError) {
        console.error("Failed to save history:", historyError);
        // Don't fail the request if history saving fails
      }
    }

    // 4️⃣ Return success response
    res.status(200).json({
      success: true,
      message: "Code generated successfully",
      data: {
        code: result.code,
        prompt,
        framework
      }
    });

  } catch (error) {
    console.error("Generate code error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ================= GET USER HISTORY =================
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent excessive data

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};