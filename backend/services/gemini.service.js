const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        maxOutputTokens: 8192,
      }
    });
  }

  async generateCode(prompt, framework) {
    try {
      const fullPrompt = `
You are a senior-level frontend engineer and UI/UX specialist with deep expertise in building production-ready, modern web interfaces. You are highly skilled in HTML5, CSS3, Tailwind CSS, Bootstrap, JavaScript (ES6+), React, Next.js, Vue.js, Angular, and performance optimization best practices.

Generate a fully functional, modern, animated, and responsive UI component.

UI Component Description: ${prompt}
Framework / Technology to Use: ${framework}

STRICT OUTPUT RULES:
- Return ONLY the final code.
- Wrap the entire response inside ONE single Markdown fenced code block.
- Do NOT include explanations, comments, headings, or extra text.
- Do NOT include inline code comments.
- Provide a complete standalone HTML file.
- The file must work immediately when opened in a browser.
- CRITICAL: Never truncate the code. You must finish the code block properly. Ensure your response ends with the closing </html> tag.

TECHNICAL REQUIREMENTS:
- Use semantic HTML5 structure.
- Follow clean code principles (proper indentation, organized structure).
- Use modern ES6+ JavaScript where required.
- Follow accessibility best practices (ARIA attributes, alt text, proper roles).
- Ensure cross-browser compatibility.
- Avoid redundant or unused code.

UI / UX DESIGN REQUIREMENTS:
- Premium, modern, professional design.
- Fully responsive (mobile-first approach).
- Use Flexbox or CSS Grid for layout.
- Include smooth animations and transitions (GPU-optimized where possible).
- Add high-quality hover effects and micro-interactions.
- Use soft shadows, depth, and layered UI.
- Elegant typography with proper spacing and visual hierarchy.
- Use a balanced, modern, non-harsh color palette.
- Ensure perfect alignment and spacing across devices.
- For ANY placeholder images, ONLY use working modern services like Unsplash Source. NEVER use "via.placeholder.com" as it is obsolete and broken.

SEO & PERFORMANCE:
- Include proper meta tags (charset, viewport, title, description).
- Optimize structure for SEO.
- Use CDN links only if necessary.
- Ensure fast rendering and smooth performance.
- Keep dependencies minimal and optimized.

Generate a real-world, visually impressive, production-grade component that reflects expert frontend engineering standards.

Return ONLY the complete HTML file inside one Markdown code block.
`;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Extract code from markdown code blocks
      const codeMatch = text.match(/```(?:html)?\n?([\s\S]*?)```/);
      const extractedCode = codeMatch ? codeMatch[1].trim() : text.trim();

      return {
        success: true,
        code: extractedCode,
        rawResponse: text
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        success: false,
        error: error.message,
        code: ""
      };
    }
  }
}

module.exports = new GeminiService();