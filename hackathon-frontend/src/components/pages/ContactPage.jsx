import { motion } from "framer-motion";
import PublicNavbar from "./PublicNavbar";

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">

      <PublicNavbar />

      <div className="max-w-5xl mx-auto px-6 py-24">

        <motion.div
          initial={{opacity:0, y:30}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.8}}
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
          initial={{opacity:0, y:40}}
          whileInView={{opacity:1, y:0}}
          transition={{duration:0.8}}
          className="bg-slate-900 p-10 rounded-xl border border-cyan-500/20 space-y-6"
        >

          <div>
            <label className="block text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>


          <div>
            <label className="block text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>


          <div>
            <label className="block text-gray-400 mb-2">
              Message
            </label>
            <textarea
              rows="5"
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>


          <motion.button
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            className="px-8 py-3 bg-cyan-500 text-black rounded-lg font-semibold shadow-lg shadow-cyan-500/40"
            
          >
            Send Message
          </motion.button>

        </motion.form>

      </div>

    </div>
  );
}