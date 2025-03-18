import React from "react";
import { Phone, ExternalLink, Info, AlertTriangle, Heart } from "lucide-react";
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

interface ResourceCardProps {
  title: string;
  description: string;
  contactInfo?: string;
  website?: string;
  icon?: React.ReactNode;
  urgent?: boolean;
}

const ResourceCard = ({
  title = "Resource Title",
  description = "Description of the resource and how it can help.",
  contactInfo,
  website,
  icon = <Info className="h-5 w-5" />,
  urgent = false,
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
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span className="text-blue-600 hover:underline">{website}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
};

const EmergencyResources = () => {
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
    },
    {
      title: "Anxiety and Depression Association",
      description:
        "Evidence-based resources for understanding and managing anxiety, depression, and related disorders.",
      website: "adaa.org/resources",
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Sleep Foundation",
      description:
        "Information and strategies for improving sleep quality and addressing sleep disorders.",
      website: "sleepfoundation.org",
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="w-full h-full p-6 bg-white overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Emergency Resources</h1>
        <p className="text-muted-foreground mb-8">
          Access immediate help and self-care resources when you need them most.
        </p>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-semibold">Crisis Support</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            If you're experiencing a mental health emergency or crisis, please
            contact one of these resources immediately:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crisisResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Self-Help Materials</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Explore these resources to support your mental wellbeing and develop
            coping strategies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selfHelpResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
