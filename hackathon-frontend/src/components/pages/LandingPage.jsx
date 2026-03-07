import { motion } from "framer-motion";
import PublicNavbar from "../pages/PublicNavbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function LandingPage() {

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Only redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const features = [
    {
      title: "Influence Heatmap",
      desc: "Highlight manipulation signals directly inside analyzed text."
    },
    {
      title: "Psychological Pattern Detection",
      desc: "Detect persuasion, propaganda and emotional triggers."
    },
    {
      title: "Influence Trend Tracking",
      desc: "Monitor how influence patterns evolve over time."
    }
  ];

  const logs = [
    "[SCAN] Processing article sentiment...",
    "[ALERT] Emotional manipulation pattern detected",
    "[INFO] Propaganda signal found in paragraph 3",
    "[SCAN] Influence risk score: 72%",
    "[DONE] Analysis complete"
  ];


  return (

    <div className="bg-slate-950 text-white min-h-screen overflow-x-hidden">

      <PublicNavbar />


      {/* HERO SECTION */}

      <section className="relative flex flex-col items-center text-center py-32 px-6">

        <motion.div
          className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[140px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-cyan-400 mb-6"
        >
          Detect Hidden Digital Manipulation
        </motion.h1>


        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl text-gray-400 mb-8"
        >
          ShadowInfluence uses AI to analyze online text and reveal hidden
          persuasion tactics, propaganda signals and psychological manipulation.
        </motion.p>


        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/auth")}
          className="px-10 py-4 bg-cyan-500 text-black rounded-lg font-semibold shadow-lg shadow-cyan-500/40 transform-gpu"
        >
          Get Started
        </motion.button>

      </section>



      {/* AI SCANNER DEMO */}

      <section className="px-10 py-24">

        <h2 className="text-3xl text-center text-cyan-400 mb-16">
          AI Influence Scanner
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto bg-slate-900 p-8 rounded-xl border border-cyan-500/30"
        >

          <p className="text-gray-400 mb-4">
            "Experts say you must support this policy or the country will collapse."
          </p>


          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "72%" }}
              transition={{ duration: 2 }}
              className="h-full bg-red-500"
            />

          </div>

          <p className="mt-4 text-red-400">
            Manipulation Risk: 72%
          </p>

        </motion.div>

      </section>



      {/* FEATURES */}

      <section className="px-10 py-20">

        <h2 className="text-3xl text-center text-cyan-400 mb-16">
          Threat Intelligence Tools
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {features.map((feature, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 p-6 rounded-xl border border-cyan-500/30"
            >

              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400">
                {feature.desc}
              </p>

            </motion.div>

          ))}

        </div>

      </section>



      {/* CYBER INTELLIGENCE FEED */}

      <section className="px-10 py-24 bg-slate-900">

        <h2 className="text-3xl text-center text-cyan-400 mb-16">
          Cyber Intelligence Feed
        </h2>


        <div className="max-w-3xl mx-auto bg-black p-6 rounded-lg font-mono text-green-400">

          {logs.map((log, index) => (

            <motion.p
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.5 }}
            >
              {log}
            </motion.p>

          ))}

        </div>

      </section>



      {/* CALL TO ACTION */}

      <section className="text-center py-24">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl text-cyan-400 mb-6"
        >
          Start Detecting Hidden Influence
        </motion.h2>


        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/auth")}
          className="px-10 py-4 bg-cyan-500 text-black rounded-lg font-semibold shadow-lg shadow-cyan-500/40 transform-gpu"
        >
          Launch Analyzer
        </motion.button>

      </section>


    </div>

  );
}