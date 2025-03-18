import React, { useState } from "react";
import { Upload, FileText, X, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DocumentProps {
  id: string;
  name: string;
  status: "processing" | "completed" | "failed";
  uploadDate: string;
  size: string;
  progress?: number;
}

const DocumentManagement = () => {
  const [documents, setDocuments] = useState<DocumentProps[]>([
    {
      id: "1",
      name: "Clinical_Guidelines_2023.pdf",
      status: "completed",
      uploadDate: "2023-10-15",
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Therapy_Approaches.docx",
      status: "processing",
      uploadDate: "2023-10-18",
      size: "1.8 MB",
      progress: 65,
    },
    {
      id: "3",
      name: "Mental_Health_Research.pdf",
      status: "failed",
      uploadDate: "2023-10-17",
      size: "5.2 MB",
    },
    {
      id: "4",
      name: "Patient_Care_Best_Practices.pdf",
      status: "completed",
      uploadDate: "2023-10-10",
      size: "3.7 MB",
    },
  ]);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Placeholder for file upload functionality
    console.log("Files selected:", e.target.files);
    // In a real implementation, this would handle the file upload process
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const filteredDocuments =
    activeTab === "all"
      ? documents
      : documents.filter((doc) => doc.status === activeTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Upload className="h-5 w-5 text-blue-500" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Document Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage documents for RAG training
            </p>
          </div>
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Documents</DialogTitle>
                <DialogDescription>
                  Upload documents to train the AI agent. Supported formats:
                  PDF, DOCX, TXT.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Input
                    type="file"
                    className="hidden"
                    id="document-upload"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF, DOCX, TXT (Max 10MB per file)
                    </p>
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Alert>
          <AlertTitle>Training Status</AlertTitle>
          <AlertDescription>
            The AI agent is currently trained on 15 documents. Last training
            completed on October 18, 2023.
          </AlertDescription>
        </Alert>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">
              All Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed (
              {documents.filter((d) => d.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing (
              {documents.filter((d) => d.status === "processing").length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({documents.filter((d) => d.status === "failed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onRemove={() => handleRemoveDocument(doc.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onRemove={() => handleRemoveDocument(doc.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onRemove={() => handleRemoveDocument(doc.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="failed" className="space-y-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onRemove={() => handleRemoveDocument(doc.id)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface DocumentCardProps {
  document: DocumentProps;
  onRemove: () => void;
}

const DocumentCard = ({ document, onRemove = () => {} }: DocumentCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center p-6">
          <div className="mr-4">
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{document.name}</h3>
              <div className="flex items-center">
                {getStatusIcon(document.status)}
                <span className="ml-2 text-sm capitalize">
                  {document.status}
                </span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>Uploaded: {document.uploadDate}</span>
              <span className="mx-2">•</span>
              <span>{document.size}</span>
            </div>
            {document.status === "processing" && document.progress && (
              <div className="mt-3">
                <Progress value={document.progress} className="h-1" />
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  {document.progress}% processed
                </span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <Check className="h-5 w-5 text-green-500" />;
    case "processing":
      return <Upload className="h-5 w-5 text-blue-500" />;
    case "failed":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

export default DocumentManagement;
