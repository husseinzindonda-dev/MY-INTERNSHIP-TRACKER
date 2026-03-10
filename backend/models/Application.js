const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role:    { type: String, required: true },
  status:  { type: String, enum: ["Applied", "Interview", "Rejected", "Offer"], default: "Applied" },
  date:    { type: String }
}, { timestamps: true })

module.exports = mongoose.model("Application", applicationSchema)
