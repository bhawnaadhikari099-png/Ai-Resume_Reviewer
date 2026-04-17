const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function reviewResume(resumeText, jobRole) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are an expert resume reviewer.
Review this resume for a ${jobRole} position.
Resume:
${resumeText}
Respond ONLY with valid JSON, no extra text:
{"scores":{"overall":72,"impact":65,"clarity":80,"keywords":60,"ats":70},"summary":"assessment here","strengths":["s1","s2","s3"],"weaknesses":["w1","w2","w3"],"rewrites":[{"original":"weak bullet","improved":"strong bullet","reason":"why"}],"keywords_missing":["k1","k2"]}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

module.exports = { reviewResume };