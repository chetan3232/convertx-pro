import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export const FilePreview = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}: FilePreviewProps) => {
  const isImage = ["jpg", "jpeg", "png", "webp"].includes(
    fileType.toLowerCase()
  );
  const isPdf = fileType.toLowerCase() === "pdf";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 z-[110] flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:inset-12"
          >
            <div className="flex items-center justify-between border-b border-border bg-card/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="max-w-[200px] truncate text-lg font-bold md:max-w-md">
                    {fileName}
                  </h3>
                  <p className="text-xs uppercase text-muted-foreground">
                    {fileType} Preview
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(fileUrl, "_blank")}
                  className="hidden md:flex"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onClose}
                  className="h-10 w-10 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-auto bg-secondary/30 p-4 md:p-12">
              {isImage && (
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-xl"
                />
              )}
              {isPdf && (
                <iframe
                  src={`${fileUrl}#toolbar=0`}
                  className="h-full w-full rounded-lg border-0 bg-white"
                  title="PDF Preview"
                />
              )}
              {!isImage && !isPdf && (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary">
                    <Download className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h4 className="mb-2 text-xl font-bold">
                    Preview not available
                  </h4>
                  <p className="mb-8 text-muted-foreground">
                    This file format cannot be previewed directly in the
                    browser.
                  </p>
                  <Button
                    className="gradient-primary text-primary-foreground"
                    onClick={() => window.open(fileUrl, "_blank")}
                  >
                    Download to View
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-center border-t border-border bg-card/50 p-4 md:justify-end">
              <Button
                onClick={onClose}
                className="w-full font-bold md:w-32"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
