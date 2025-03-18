import React, { useState } from "react";
import {
  Phone,
  ExternalLink,
  Info,
  AlertTriangle,
  Heart,
  BookOpen,
  FileText,
  Download,
  Search,
  Filter,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResourceCardProps {
  title: string;
  description: string;
  contactInfo?: string;
  website?: string;
  icon?: React.ReactNode;
  urgent?: boolean;
  documentUrl?: string;
  onViewDocument?: () => void;
}

const ResourceCard = ({
  title = "Resource Title",
  description = "Description of the resource and how it can help.",
  contactInfo,
  website,
  icon = <Info className="h-5 w-5" />,
  urgent = false,
  documentUrl,
  onViewDocument,
}: ResourceCardProps) => {
  return (
    <Card className={`h-full ${urgent ? "border-red-500 bg-red-50" : ""}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-full ${urgent ? "bg-red-100" : "bg-blue-100"}`}
          >
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {urgent && <AlertTriangle className="h-5 w-5 text-red-500" />}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {contactInfo && (
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{contactInfo}</span>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span className="text-blue-600 hover:underline">{website}</span>
          </div>
        )}
        {documentUrl && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-blue-600 hover:underline">
              Documentation available
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {website && (
          <Button variant="outline" size="sm" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        )}
        {contactInfo && !website && (
          <Button variant="outline" size="sm" className="w-full">
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
        )}
        {documentUrl && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDocument) onViewDocument();
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Document
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface Document {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "article" | "worksheet" | "guide";
  category: "anxiety" | "depression" | "stress" | "sleep" | "general";
  url: string;
}

const EmergencyResources = () => {
  const [activeTab, setActiveTab] = useState("crisis");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const crisisResources = [
    {
      title: "National Suicide Prevention Lifeline",
      description:
        "24/7, free and confidential support for people in distress, prevention and crisis resources.",
      contactInfo: "1-800-273-8255",
      website: "suicidepreventionlifeline.org",
      icon: <Phone className="h-5 w-5 text-red-500" />,
      urgent: true,
    },
    {
      title: "Crisis Text Line",
      description:
        "Text HOME to 741741 to connect with a Crisis Counselor. Free 24/7 support.",
      contactInfo: "Text HOME to 741741",
      website: "crisistextline.org",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      urgent: true,
    },
    {
      title: "SAMHSA's National Helpline",
      description:
        "Treatment referral and information service for individuals facing mental health or substance use disorders.",
      contactInfo: "1-800-662-4357",
      website: "samhsa.gov/find-help",
      icon: <Phone className="h-5 w-5 text-red-500" />,
      urgent: true,
    },
  ];

  const selfHelpResources = [
    {
      title: "Mindfulness Exercises",
      description:
        "Collection of guided meditations and mindfulness practices to help manage stress and anxiety.",
      website: "mindful.org/meditation",
      icon: <Heart className="h-5 w-5 text-blue-500" />,
      documentUrl: "mindfulness-guide.pdf",
    },
    {
      title: "Anxiety and Depression Association",
      description:
        "Evidence-based resources for understanding and managing anxiety, depression, and related disorders.",
      website: "adaa.org/resources",
      icon: <Info className="h-5 w-5 text-blue-500" />,
      documentUrl: "anxiety-resources.pdf",
    },
    {
      title: "Sleep Foundation",
      description:
        "Information and strategies for improving sleep quality and addressing sleep disorders.",
      website: "sleepfoundation.org",
      icon: <Info className="h-5 w-5 text-blue-500" />,
      documentUrl: "sleep-guide.pdf",
    },
  ];

  const documents: Document[] = [
    {
      id: "1",
      title: "Understanding Anxiety: A Comprehensive Guide",
      description:
        "Learn about the different types of anxiety disorders, their symptoms, and evidence-based treatment approaches.",
      type: "guide",
      category: "anxiety",
      url: "anxiety-guide.pdf",
    },
    {
      id: "2",
      title: "Depression Management Workbook",
      description:
        "Interactive worksheets and exercises to help track mood, identify triggers, and develop coping strategies for depression.",
      type: "worksheet",
      category: "depression",
      url: "depression-workbook.pdf",
    },
    {
      id: "3",
      title: "Stress Reduction Techniques",
      description:
        "A collection of evidence-based techniques for managing stress, including breathing exercises, progressive muscle relaxation, and mindfulness practices.",
      type: "guide",
      category: "stress",
      url: "stress-reduction.pdf",
    },
    {
      id: "4",
      title: "Sleep Hygiene Checklist",
      description:
        "A practical checklist to help improve sleep habits and create an optimal sleep environment.",
      type: "worksheet",
      category: "sleep",
      url: "sleep-checklist.pdf",
    },
    {
      id: "5",
      title: "Cognitive Behavioral Therapy Basics",
      description:
        "An introduction to CBT principles and how they can be applied to various mental health conditions.",
      type: "article",
      category: "general",
      url: "cbt-basics.pdf",
    },
    {
      id: "6",
      title: "Mindfulness Meditation Guide",
      description:
        "Step-by-step instructions for various mindfulness meditation practices to reduce anxiety and improve focus.",
      type: "guide",
      category: "anxiety",
      url: "mindfulness-guide.pdf",
    },
    {
      id: "7",
      title: "Recognizing Depression Symptoms",
      description:
        "A comprehensive overview of depression symptoms, risk factors, and when to seek professional help.",
      type: "article",
      category: "depression",
      url: "depression-symptoms.pdf",
    },
    {
      id: "8",
      title: "Healthy Boundaries Worksheet",
      description:
        "Exercises to help identify, establish, and maintain healthy boundaries in relationships.",
      type: "worksheet",
      category: "general",
      url: "boundaries-worksheet.pdf",
    },
    {
      id: "9",
      title: "Sleep Disorders Overview",
      description:
        "Information about common sleep disorders, their symptoms, and treatment options.",
      type: "article",
      category: "sleep",
      url: "sleep-disorders.pdf",
    },
  ];

  // Filter documents based on search term and category filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle document view
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };

  // Get unique categories for filtering
  const categories = Array.from(new Set(documents.map((doc) => doc.category)));

  return (
    <div className="w-full h-full p-6 bg-background overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Resources</h1>
        <p className="text-muted-foreground mb-6">
          Access immediate help, self-care resources, and educational materials
          when you need them most.
        </p>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Crisis Support
            </TabsTrigger>
            <TabsTrigger value="self-help" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Self-Help
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crisis" className="mt-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold">Crisis Support</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                If you're experiencing a mental health emergency or crisis,
                please contact one of these resources immediately:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crisisResources.map((resource, index) => (
                  <ResourceCard key={index} {...resource} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="self-help" className="mt-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Self-Help Materials</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Explore these resources to support your mental wellbeing and
                develop coping strategies:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selfHelpResources.map((resource, index) => (
                  <ResourceCard
                    key={index}
                    {...resource}
                    onViewDocument={() => {
                      const doc = documents.find(
                        (d) => d.url === resource.documentUrl,
                      );
                      if (doc) handleViewDocument(doc);
                    }}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">
                    Educational Documents
                  </h2>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      {categoryFilter
                        ? `Category: ${categoryFilter}`
                        : "All Categories"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                      All Categories
                    </DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {filteredDocuments.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="h-full">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-blue-100">
                              {doc.type === "guide" ? (
                                <BookOpen className="h-5 w-5 text-blue-500" />
                              ) : doc.type === "worksheet" ? (
                                <FileText className="h-5 w-5 text-green-500" />
                              ) : (
                                <Info className="h-5 w-5 text-purple-500" />
                              )}
                            </div>
                            <CardTitle className="text-lg">
                              {doc.title}
                            </CardTitle>
                          </div>
                          <div className="mt-2 flex">
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                              {doc.category}
                            </span>
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full ml-2">
                              {doc.type}
                            </span>
                          </div>
                          <CardDescription className="mt-2">
                            {doc.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Document
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No documents found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || categoryFilter
                      ? "No documents match your search criteria"
                      : "There are no documents available at this time"}
                  </p>
                  {(searchTerm || categoryFilter) && (
                    <div className="flex gap-2">
                      {searchTerm && (
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      )}
                      {categoryFilter && (
                        <Button
                          variant="outline"
                          onClick={() => setCategoryFilter(null)}
                        >
                          Clear Category Filter
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Document Viewer Dialog */}
        <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedDocument?.title}</DialogTitle>
              <DialogDescription>
                {selectedDocument?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4 border rounded-md my-4 bg-slate-50">
              {/* This would be the actual document content in a real implementation */}
              <div className="prose max-w-none">
                <h2>Document Content</h2>
                <p>
                  This is a placeholder for the actual document content. In a
                  real implementation, this would display the PDF or formatted
                  content of the document.
                </p>
                <p>
                  The document would provide detailed information about{" "}
                  {selectedDocument?.title.toLowerCase()}.
                </p>
                <h3>Key Points</h3>
                <ul>
                  <li>
                    Important information about {selectedDocument?.category}
                  </li>
                  <li>Evidence-based strategies and techniques</li>
                  <li>Practical exercises and examples</li>
                  <li>Additional resources and references</li>
                </ul>
                <p>
                  This document is designed to help users better understand and
                  manage their mental health concerns related to{" "}
                  {selectedDocument?.category}.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDocumentDialogOpen(false)}
              >
                Close
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmergencyResources;
