import { motion } from "framer-motion";
import {
  Combine, Scissors, Minimize2, RotateCw,
  Lock, Unlock, Stamp, ScanText,
} from "lucide-react";

const tools = [
  { icon: Combine, title: "Merge PDF", desc: "Combine multiple PDFs into one" },
  { icon: Scissors, title: "Split PDF", desc: "Extract pages or split documents" },
  { icon: Minimize2, title: "Compress PDF", desc: "Reduce file size without losing quality" },
  { icon: RotateCw, title: "Rotate Pages", desc: "Rotate and reorder PDF pages" },
  { icon: Lock, title: "Protect PDF", desc: "Add password protection" },
  { icon: Unlock, title: "Unlock PDF", desc: "Remove password from PDF" },
  { icon: Stamp, title: "Watermark", desc: "Add text or image watermarks" },
  { icon: ScanText, title: "OCR", desc: "Extract text from scanned documents" },
];

const ToolsGrid = () => (
  <section id="tools" className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          PDF <span className="gradient-text">Power Tools</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Everything you need to manage, edit, and optimize your documents
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass rounded-xl p-6 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <tool.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{tool.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ToolsGrid;
