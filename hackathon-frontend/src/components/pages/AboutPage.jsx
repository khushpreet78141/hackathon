import { motion } from "framer-motion";
import PublicNavbar from "./PublicNavbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">

      <PublicNavbar />

      <div className="max-w-6xl mx-auto px-6 py-24 space-y-20">

        {/* Title */}
        <motion.div
          initial={{opacity:0, y:30}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.8}}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-cyan-400 mb-6">
            About ShadowInfluence
          </h1>

          <p className="text-gray-400 max-w-3xl mx-auto">
            ShadowInfluence is an AI-powered platform designed to detect hidden
            persuasion tactics, propaganda signals, and psychological influence
            patterns embedded within digital content.
          </p>
        </motion.div>


        {/* Mission Section */}
        <motion.div
          initial={{opacity:0, y:40}}
          whileInView={{opacity:1, y:0}}
          transition={{duration:0.8}}
          className="bg-slate-900 p-10 rounded-xl border border-cyan-500/20"
        >

          <h2 className="text-3xl text-cyan-400 mb-4">
            Our Mission
          </h2>

          <p className="text-gray-400 leading-relaxed">
            The internet is flooded with persuasive messaging designed to
            influence public opinion. Many of these messages contain subtle
            psychological triggers that manipulate emotions and perceptions.
            ShadowInfluence uses artificial intelligence to analyze language
            patterns and highlight potential manipulation tactics so that
            individuals can make more informed decisions.
          </p>

        </motion.div>


        {/* Technology Section */}
        <div className="grid md:grid-cols-3 gap-8">

          {[
            {
              title:"AI Text Analysis",
              desc:"Advanced models analyze linguistic patterns and detect manipulation signals."
            },
            {
              title:"Visualization Tools",
              desc:"Heatmaps, radar charts, and trend graphs help users understand influence patterns."
            },
            {
              title:"Threat Intelligence",
              desc:"The system highlights propaganda techniques and emotional triggers in text."
            }
          ].map((item,index)=>(

            <motion.div
              key={index}
              initial={{opacity:0, y:30}}
              whileInView={{opacity:1, y:0}}
              whileHover={{scale:1.05}}
              transition={{duration:0.5}}
              className="bg-slate-900 p-6 rounded-xl border border-cyan-500/20"
            >

              <h3 className="text-xl font-semibold text-cyan-400 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-400">
                {item.desc}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </div>
  );
}