import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Combine,
  Scissors,
  Minimize2,
  RotateCw,
  Lock,
  Unlock,
  Stamp,
  ScanText,
  Code2,
  FileJson,
  Table2,
  BookOpen,
} from "lucide-react";

const categories = [
  {
    name: "PDF Essentials",
    tools: [
      {
        icon: Combine,
        title: "Merge PDF",
        desc: "Combine multiple PDFs",
        slug: "merge",
      },
      {
        icon: Scissors,
        title: "Split PDF",
        desc: "Extract pages",
        slug: "split",
      },
      {
        icon: Minimize2,
        title: "Compress PDF",
        desc: "Reduce file size",
        slug: "compress",
      },
      {
        icon: RotateCw,
        title: "Rotate Pages",
        desc: "Fix orientation",
        slug: "rotate",
      },
    ],
  },
  {
    name: "Security & Trust",
    tools: [
      {
        icon: Lock,
        title: "Protect PDF",
        desc: "Add password",
        slug: "protect",
      },
      {
        icon: Unlock,
        title: "Unlock PDF",
        desc: "Remove password",
        slug: "unlock",
      },
      {
        icon: Stamp,
        title: "Watermark",
        desc: "Add text/images",
        slug: "watermark",
      },
      {
        icon: ScanText,
        title: "OCR Engine",
        desc: "AI Text extraction",
        slug: "ocr",
      },
    ],
  },
  {
    name: "Developer & Data",
    tools: [
      {
        icon: FileJson,
        title: "JSON ↔ CSV",
        desc: "Data transformation",
        slug: "json-csv",
      },
      {
        icon: Table2,
        title: "Excel to PDF",
        desc: "Perfect table layout",
        slug: "excel-pdf",
      },
      {
        icon: Code2,
        title: "HTML to PDF",
        desc: "Webpage to document",
        slug: "html-pdf",
      },
      {
        icon: BookOpen,
        title: "MOBI → EPUB",
        desc: "eBook conversion",
        slug: "mobi-epub",
      },
    ],
  },
];

const ToolsGrid = () => (
  <section id="tools" className="relative overflow-hidden py-24">
    <div className="absolute right-0 top-0 -mr-64 -mt-64 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Professional <span className="gradient-text">Power Tools</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Tailored solutions for students, developers, and enterprise workflows.
        </p>
      </motion.div>

      <div className="space-y-16">
        {categories.map((category, catIdx) => (
          <div key={category.name}>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-primary"
            >
              {category.name}
            </motion.h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {category.tools.map((tool, i) => (
                <Link key={tool.title} to={`/tools/${tool.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + catIdx * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass glass-hover group cursor-pointer rounded-2xl p-6"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/10">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="mb-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {tool.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {tool.desc}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ToolsGrid;
