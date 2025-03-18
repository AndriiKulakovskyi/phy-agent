import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Settings, Eye, Volume2, Type, X } from "lucide-react";

interface AccessibilityControlsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AccessibilityControls = ({
  isOpen = true,
  onClose = () => {},
}: AccessibilityControlsProps) => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [voiceSpeed, setVoiceSpeed] = useState([1]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-lg border bg-background p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h3 className="font-medium">Accessibility Controls</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span>Screen Reader</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  checked={screenReaderEnabled}
                  onCheckedChange={setScreenReaderEnabled}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enable screen reader support</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span>High Contrast</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  checked={highContrastMode}
                  onCheckedChange={setHighContrastMode}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enable high contrast mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span>Font Size</span>
          </div>
          <Slider
            value={fontSize}
            onValueChange={setFontSize}
            max={24}
            min={12}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Small</span>
            <span>Current: {fontSize[0]}px</span>
            <span>Large</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span>Voice Speed</span>
          </div>
          <Slider
            value={voiceSpeed}
            onValueChange={setVoiceSpeed}
            max={2}
            min={0.5}
            step={0.1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span>
            <span>Current: {voiceSpeed[0].toFixed(1)}x</span>
            <span>Fast</span>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default AccessibilityControls;
