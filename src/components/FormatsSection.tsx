import { motion } from "framer-motion";

const formats = [
  { ext: "PDF",  color: "bg-red-500/10 text-red-600 border-red-500/20", hot: true },
  { ext: "DOCX", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", hot: true },
  { ext: "XLSX", color: "bg-green-500/10 text-green-600 border-green-500/20", hot: false },
  { ext: "PPTX", color: "bg-orange-500/10 text-orange-600 border-orange-500/20", hot: false },
  { ext: "TXT",  color: "bg-gray-500/10 text-gray-600 border-gray-500/20", hot: false },
  { ext: "HTML", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", hot: false },
  { ext: "MD",   color: "bg-slate-500/10 text-slate-600 border-slate-500/20", hot: false },
  { ext: "RTF",  color: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20", hot: false },
  { ext: "EPUB", color: "bg-violet-500/10 text-violet-600 border-violet-500/20", hot: false },
  { ext: "MOBI", color: "bg-purple-500/10 text-purple-600 border-purple-500/20", hot: false },
  { ext: "CSV",  color: "bg-teal-500/10 text-teal-600 border-teal-500/20", hot: false },
  { ext: "JSON", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20", hot: false },
  { ext: "XML",  color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20", hot: false },
  { ext: "JPG",  color: "bg-pink-500/10 text-pink-600 border-pink-500/20", hot: false },
  { ext: "PNG",  color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", hot: true },
  { ext: "WEBP", color: "bg-rose-500/10 text-rose-600 border-rose-500/20", hot: false },
  { ext: "DOC",  color: "bg-blue-400/10 text-blue-500 border-blue-400/20", hot: false },
  { ext: "XLS",  color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", hot: false },
  { ext: "PPT",  color: "bg-orange-400/10 text-orange-500 border-orange-400/20", hot: false },
  { ext: "OCR",  color: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20", hot: true },
];

const FormatsSection = () => (
  <section className="py-20">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Every format you'll <span className="gradient-text">ever need</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          25+ formats supported. Auto-detected from MIME type and file content.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3"
      >
        {formats.map((f, i) => (
          <motion.div
            key={f.ext}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3, scale: 1.06 }}
            className={`relative cursor-default rounded-xl border px-4 py-2 text-sm font-bold transition-shadow hover:shadow-md ${f.color}`}
          >
            {f.ext}
            {f.hot && (
              <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary" />
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        🔥 Hot formats highlighted · More coming in Phase 2
      </p>
    </div>
  </section>
);

export default FormatsSection;
