import React, { createContext, useContext, useState, useEffect } from "react";
import { documentApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface Document {
  id: string;
  name: string;
  status: "processing" | "completed" | "failed";
  uploadDate: string;
  size: string;
  contextNotes?: string;
}

interface DocumentContextType {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  loadDocuments: () => Promise<void>;
  uploadDocument: (
    name: string,
    content: string,
    contextNotes?: string,
  ) => Promise<void>;
  updateDocumentNotes: (id: string, contextNotes: string) => Promise<void>;
  removeDocument: (id: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined,
);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load documents when user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      loadDocuments();
    } else {
      setDocuments([]);
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      const apiDocuments = await documentApi.getDocuments(user.token);

      const formattedDocuments: Document[] = apiDocuments.map((doc: any) => ({
        id: doc.id.toString(),
        name: doc.name,
        status: doc.status,
        uploadDate: new Date(doc.created_at).toISOString().split("T")[0],
        size: "Unknown", // Size would come from backend in a real implementation
        contextNotes: doc.context_notes,
      }));

      setDocuments(formattedDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (
    name: string,
    content: string,
    contextNotes?: string,
  ) => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await documentApi.uploadDocument(
        user.token,
        name,
        content,
        contextNotes,
      );

      // Add new document to state
      const newDocument: Document = {
        id: response.id.toString(),
        name: response.name,
        status: response.status,
        uploadDate: new Date().toISOString().split("T")[0],
        size: "Unknown", // Size would come from backend in a real implementation
        contextNotes,
      };

      setDocuments([newDocument, ...documents]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocumentNotes = async (id: string, contextNotes: string) => {
    // In a real implementation, this would call an API endpoint
    // For now, we'll just update the local state
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, contextNotes } : doc)),
    );
  };

  const removeDocument = (id: string) => {
    // In a real implementation, this would call an API endpoint
    // For now, we'll just update the local state
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        isLoading,
        error,
        loadDocuments,
        uploadDocument,
        updateDocumentNotes,
        removeDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};
