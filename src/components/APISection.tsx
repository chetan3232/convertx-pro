import { motion } from "framer-motion";
import { Code2, Cpu, Globe, Lock, Terminal, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/settings-store";
import { toast } from "sonner";

const apiFeatures = [
  {
    icon: Terminal,
    title: "Simple SDKs",
    desc: "Integrate in minutes with our Node.js, Python, and Go libraries.",
  },
  {
    icon: Cpu,
    title: "High Performance",
    desc: "Distributed processing for low-latency document handling.",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    desc: "End-to-end encryption for all API data transfers.",
  },
  {
    icon: Globe,
    title: "Global Edge",
    desc: "API endpoints optimized for global performance and reliability.",
  },
];

const APISection = () => {
  const { apiKey, setApiKey } = useSettingsStore();

  const generateKey = () => {
    const newKey = "cxp_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success("API Key generated successfully!");
  };

  const copyKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success("API Key copied to clipboard!");
    }
  };

  const codeSnippet = `// Convert PDF to Word via API
const convert = async (file) => {
  const response = await fetch('https://api.convertx.pro/v1/convert', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ${apiKey || 'YOUR_KEY'}' },
    body: file
  });
  return await response.json();
};`;

  return (
    <section id="api" className="relative overflow-hidden py-24">
      <div className="absolute left-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
      
      <div className="container relative">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Built for <span className="gradient-text">Developers</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Scale your document workflows with our powerful REST API. 
                Everything you can do on the web, you can do with code.
              </p>

              {apiKey ? (
                <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      <span className="text-sm font-bold uppercase tracking-wider text-primary">Your Active API Key</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={generateKey} className="text-xs">Regenerate</Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 rounded-lg bg-background/50 p-3 font-mono text-sm text-foreground border border-border">
                      {apiKey}
                    </code>
                    <Button onClick={copyKey} className="gradient-primary border-0">Copy</Button>
                  </div>
                </div>
              ) : (
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button className="gradient-primary border-0 text-primary-foreground" size="lg">
                    <Code2 className="mr-2 h-5 w-5" />
                    Read API Docs
                  </Button>
                  <Button variant="outline" size="lg" onClick={generateKey}>
                    Get Free API Key
                  </Button>
                </div>
              )}

              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                {apiFeatures.map((feature) => (
                  <div key={feature.title} className="group">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="mb-2 font-bold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-slate-950 p-1 shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-2 border-white/10 bg-white/5 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="ml-4 text-[10px] font-medium uppercase tracking-widest text-white/30">
                  conversion_demo.js
                </div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto">
                <pre>
                  <code>{codeSnippet}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default APISection;
