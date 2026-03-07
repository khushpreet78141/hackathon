import { useState } from "react";
import { motion } from "framer-motion";
import PublicNavbar from "./PublicNavbar";
import axios from "axios";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post("http://localhost:3000/api/contact", formData);
      setStatus("Message Sent Successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">
      <PublicNavbar />

      <div className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-cyan-400 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400">
            Have questions about ShadowInfluence or our AI analysis platform?
            Reach out to us.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 p-10 rounded-xl border border-cyan-500/20 space-y-6"
        >
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {status && (
            <p className={`text-sm ${status.includes("Successfully") ? "text-green-400" : "text-cyan-400"}`}>
              {status}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={status === "Sending..."}
            className="px-8 py-3 bg-cyan-500 text-black rounded-lg font-semibold shadow-lg shadow-cyan-500/40 disabled:opacity-50"
          >
            {status === "Sending..." ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}