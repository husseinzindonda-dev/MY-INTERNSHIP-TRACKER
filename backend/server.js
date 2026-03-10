require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const Application = require("./models/Application")
const OpenAI = require("openai")

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null

const app = express()
app.use(express.json())
app.use(cors())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err))

// GET all applications
app.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST new application
app.post("/applications", async (req, res) => {
  try {
    const { company, role, status, date } = req.body
    if (!company || !role) return res.status(400).json({ error: "Company and role are required" })
    const newApp = new Application({ company, role, status, date })
    await newApp.save()
    res.status(201).json(newApp)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT update status
app.put("/applications/:id", async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE application
app.delete("/applications/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET profile
app.get("/profile", async (req, res) => {
  try {
    const db = mongoose.connection.db
    const profile = await db.collection("profile").findOne({ id: "user" })
    res.json(profile || { bio: "" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// SAVE profile
app.post("/profile", async (req, res) => {
  try {
    const db = mongoose.connection.db
    await db.collection("profile").updateOne(
      { id: "user" },
      { $set: { id: "user", bio: req.body.bio } },
      { upsert: true }
    )
    res.json({ message: "Profile saved" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PARSE RESUME
app.post("/parse-resume", async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ error: "AI features not available" })
    const { resumeText } = req.body
    if (!resumeText) return res.status(400).json({ error: "No resume text provided" })

    console.log("Sending resume to OpenAI...")
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Extract a clean candidate profile from this resume.
Include: skills, experience, education, and key achievements.
Write it as a clear paragraph summary, not bullet points.
Keep it under 200 words.

RESUME:
${resumeText}`
        }
      ]
    })

    const bio = completion.choices[0].message.content
    console.log("OpenAI responded successfully")

    const db = mongoose.connection.db
    await db.collection("profile").updateOne(
      { id: "user" },
      { $set: { id: "user", bio } },
      { upsert: true }
    )

    res.json({ bio })
  } catch (err) {
    console.error("Parse resume error:", err.message)
    res.status(500).json({ error: err.message })
  }
})

// MATCH scoring
app.post("/match", async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ error: "AI features not available" })
    const { jobDescription, userProfile } = req.body
    if (!jobDescription || !userProfile) {
      return res.status(400).json({ error: "Job description and profile are required" })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `You are a top tech recruiter with 10+ years of experience. Analyze how well this candidate matches the job description.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE:
${userProfile}

Respond in this exact JSON format with no extra text:
{
  "score": <number 0-100>,
  "summary": "<2 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "advice": "<1 concrete action to improve match>"
}`
        }
      ]
    })

    const text = completion.choices[0].message.content.replace(/```json|```/g, "").trim()
    const result = JSON.parse(text)
    res.json(result)
  } catch (err) {
    console.error("Match error:", err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(5000, () => console.log("Server running on https://internship-tracker-backend-yvgs.onrender.com"))
