import React, { useState } from "react";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface ConversationExportProps {
  onExport?: (options: ExportOptions) => void;
}

export interface ExportOptions {
  format: "csv" | "json";
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  includeUserInfo: boolean;
  includeMetadata: boolean;
  anonymize: boolean;
}

const ConversationExport: React.FC<ConversationExportProps> = ({
  onExport = (options) => console.log("Export options:", options),
}) => {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [includeUserInfo, setIncludeUserInfo] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [anonymize, setAnonymize] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    const exportOptions: ExportOptions = {
      format,
      dateRange,
      includeUserInfo,
      includeMetadata,
      anonymize,
    };

    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onExport(exportOptions);
            setIsExporting(false);
            setOpen(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Download className="h-4 w-4 mr-2" />
        Export Conversations
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Conversation Data</DialogTitle>
            <DialogDescription>
              Configure your export options. You can filter by date range and
              choose what data to include.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Format
              </Label>
              <div className="col-span-3 flex gap-4">
                <Button
                  type="button"
                  variant={format === "csv" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFormat("csv")}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  type="button"
                  variant={format === "json" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFormat("json")}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date Range</Label>
              <div className="col-span-3">
                <DatePicker date={dateRange} setDate={setDateRange} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Include</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeUserInfo"
                    checked={includeUserInfo}
                    onCheckedChange={(checked) =>
                      setIncludeUserInfo(checked === true)
                    }
                  />
                  <Label htmlFor="includeUserInfo">User Information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked) =>
                      setIncludeMetadata(checked === true)
                    }
                  />
                  <Label htmlFor="includeMetadata">Conversation Metadata</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymize"
                    checked={anonymize}
                    onCheckedChange={(checked) =>
                      setAnonymize(checked === true)
                    }
                  />
                  <Label htmlFor="anonymize">Anonymize Personal Data</Label>
                </div>
              </div>
            </div>

            {isExporting && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Progress</Label>
                <div className="col-span-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationExport;
