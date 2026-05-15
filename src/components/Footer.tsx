import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-border py-20">
    <div className="absolute bottom-0 left-0 -mb-48 -ml-48 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
    <div className="container relative">
      <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Convert<span className="gradient-text">X</span> Pro
            </span>
          </div>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The world's most advanced privacy-first document processing
            platform. Engineered for students, developers, and enterprise scale.
          </p>
          <div className="flex gap-4">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-all hover:bg-primary/10 hover:text-primary">
              <Twitter className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-all hover:bg-primary/10 hover:text-primary">
              <Github className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-all hover:bg-primary/10 hover:text-primary">
              <Linkedin className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground">
            Product
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <a
                href="#convert"
                className="transition-colors hover:text-primary"
              >
                Converter
              </a>
            </li>
            <li>
              <a href="#tools" className="transition-colors hover:text-primary">
                PDF Tools
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                OCR Engine
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                API Keys
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground">
            Resources
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-foreground">
            Support
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                System Status
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-primary">
                Security
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
        <p className="text-xs text-muted-foreground">
          © 2026 ConvertX Pro. All processing is transient and local-first where
          possible.
        </p>
        <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <span>v1.0.0 MVP</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            All Systems Operational
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
