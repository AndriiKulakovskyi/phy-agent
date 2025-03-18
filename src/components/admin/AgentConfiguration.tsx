import React, { useState } from "react";
import { Settings, Sliders, MessageSquare, Shield, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentConfigurationProps {
  onSave?: (config: AgentConfig) => void;
  initialConfig?: AgentConfig;
}

interface AgentConfig {
  name: string;
  description: string;
  responseStyle: string;
  responseLength: number;
  empathyLevel: number;
  personalityTraits: string;
  safetyLevel: string;
  triggerWords: string;
  emergencyProtocol: string;
  enableVoiceResponses: boolean;
  voiceType: string;
  voiceSpeed: number;
}

const AgentConfiguration = ({
  onSave = () => {},
  initialConfig = {
    name: "Supportive Companion",
    description:
      "A compassionate AI assistant focused on providing mental health support",
    responseStyle: "empathetic",
    responseLength: 75,
    empathyLevel: 80,
    personalityTraits: "Compassionate, patient, understanding, non-judgmental",
    safetyLevel: "high",
    triggerWords: "suicide, self-harm, abuse",
    emergencyProtocol:
      "Provide crisis resources and recommend immediate professional help",
    enableVoiceResponses: true,
    voiceType: "calm",
    voiceSpeed: 50,
  },
}: AgentConfigurationProps) => {
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<AgentConfig>({
    defaultValues: initialConfig,
  });

  const handleSubmit = (data: AgentConfig) => {
    onSave(data);
    // In a real implementation, this would save to backend
    console.log("Agent configuration saved:", data);
  };

  return (
    <div className="w-full h-full p-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Agent Configuration</h1>
        <p className="text-muted-foreground mb-8">
          Customize how the AI agent responds to users and set safety
          parameters.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <Tabs
              defaultValue="general"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="general">
                  <Settings className="mr-2 h-4 w-4" />
                  General Settings
                </TabsTrigger>
                <TabsTrigger value="personality">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Personality & Responses
                </TabsTrigger>
                <TabsTrigger value="safety">
                  <Shield className="mr-2 h-4 w-4" />
                  Safety Parameters
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Configuration</CardTitle>
                    <CardDescription>
                      Set the fundamental properties of your AI agent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agent Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Supportive Companion"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This name will be displayed to users during
                            conversations.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the purpose and capabilities of this agent"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of what this agent does and how
                            it helps users.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enableVoiceResponses"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Voice Responses
                            </FormLabel>
                            <FormDescription>
                              Allow the agent to respond with voice in addition
                              to text.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {form.watch("enableVoiceResponses") && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Voice Settings</CardTitle>
                      <CardDescription>
                        Configure how the agent's voice sounds to users.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="voiceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voice Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a voice type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="calm">Calm</SelectItem>
                                <SelectItem value="soothing">
                                  Soothing
                                </SelectItem>
                                <SelectItem value="friendly">
                                  Friendly
                                </SelectItem>
                                <SelectItem value="professional">
                                  Professional
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The overall tone and quality of the agent's voice.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="voiceSpeed"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Voice Speed</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  defaultValue={[value]}
                                  onValueChange={(vals) => onChange(vals[0])}
                                  {...field}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Slower</span>
                                  <span>{value}%</span>
                                  <span>Faster</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Adjust how quickly the agent speaks.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="personality" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personality Configuration</CardTitle>
                    <CardDescription>
                      Define how the agent interacts with users and its
                      communication style.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="responseStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response Style</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a response style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="empathetic">
                                Empathetic
                              </SelectItem>
                              <SelectItem value="informative">
                                Informative
                              </SelectItem>
                              <SelectItem value="supportive">
                                Supportive
                              </SelectItem>
                              <SelectItem value="coaching">Coaching</SelectItem>
                              <SelectItem value="reflective">
                                Reflective
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The overall tone the agent uses when responding to
                            users.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responseLength"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Response Length</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                                {...field}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Concise</span>
                                <span>{value}%</span>
                                <span>Detailed</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            How detailed the agent's responses should be.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="empathyLevel"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Empathy Level</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                                {...field}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Neutral</span>
                                <span>{value}%</span>
                                <span>Highly Empathetic</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            How much emotional understanding the agent should
                            express.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalityTraits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personality Traits</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. Compassionate, patient, understanding, non-judgmental"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of traits that define the
                            agent's personality.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Safety Parameters</CardTitle>
                    <CardDescription>
                      Configure safety settings to ensure appropriate responses
                      in sensitive situations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="safetyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Safety Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a safety level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="maximum">Maximum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Determines how strictly the agent filters content
                            and responds to sensitive topics.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="triggerWords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trigger Words</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. suicide, self-harm, abuse"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of words that should trigger
                            special handling or escalation.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyProtocol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Protocol</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe how the agent should respond in emergency situations"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Instructions for how the agent should respond when
                            trigger words are detected.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AgentConfiguration;
