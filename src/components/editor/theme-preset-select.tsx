import React, { useCallback, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemePreset } from "../../types/theme";
import { useEditorStore } from "../../store/editor-store";
import { getPresetThemeStyles } from "../../utils/theme-presets";
import { Button } from "../ui/button";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Moon,
  Search,
  Shuffle,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../ui/input";

interface ThemePresetSelectProps {
  presets: Record<string, ThemePreset>;
  currentPreset: string | null;
  onPresetChange: (preset: string) => void;
}

const ColorBox = ({ color }: { color: string }) => {
  return (
    <div
      className="h-3 w-3 rounded-sm border border-muted"
      style={{ backgroundColor: color }}
    />
  );
};

const ThemePresetSelect: React.FC<ThemePresetSelectProps> = ({
  presets,
  currentPreset,
  onPresetChange,
}) => {
  const { themeState } = useEditorStore();
  const { theme, toggleTheme } = useTheme();
  const mode = themeState.currentMode;
  const [search, setSearch] = useState("");

  const presetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);
  const value = presetNames?.find((name) => name === currentPreset);
  const currentIndex = useMemo(
    () => presetNames.indexOf(value || "default"),
    [presetNames, value]
  );

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length);
    onPresetChange(presetNames[random]);
  }, [onPresetChange, presetNames]);

  const cycleTheme = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % presetNames.length
          : (currentIndex - 1 + presetNames.length) % presetNames.length;
      onPresetChange(presetNames[newIndex]);
    },
    [currentIndex, presetNames, onPresetChange]
  );

  const filteredPresets = useMemo(() => {
    return search.trim() === ""
      ? presetNames
      : presetNames.filter((name) =>
          name.toLowerCase().includes(search.toLowerCase())
        );
  }, [presetNames, search]);

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:min-w-72 h-10 justify-between group relative"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  <ColorBox
                    color={getPresetThemeStyles(value || "default")[mode].primary}
                  />
                  <ColorBox
                    color={getPresetThemeStyles(value || "default")[mode].accent}
                  />
                  <ColorBox
                    color={getPresetThemeStyles(value || "default")[mode].secondary}
                  />
                  <ColorBox
                    color={getPresetThemeStyles(value || "default")[mode].border}
                  />
                </div>
                <span className="capitalize font-medium">
                  {(value || "default").replace(/-/g, " ")}
                </span>
              </div>
              <ChevronDown className="size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start">
            <Command className="rounded-lg border shadow-md w-full">
              <div className="flex items-center w-full">
                <div className="flex items-center w-full border-b px-3 py-1">
                  <Search className="size-4 shrink-0 opacity-50" />
                  <Input
                    placeholder="Search themes..."
                    className="shadow-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <div className="text-xs text-muted-foreground">
                  {filteredPresets.length} theme
                  {filteredPresets.length !== 1 ? "s" : ""}
                </div>
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={toggleTheme}
                      >
                        {theme === "light" ? (
                          <Sun className="h-3.5 w-3.5" />
                        ) : (
                          <Moon className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Toggle theme</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={randomize}
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Random theme</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Separator />
              <ScrollArea className="h-[500px] max-h-[70vh]">
                <CommandEmpty>No themes found.</CommandEmpty>
                <CommandGroup>
                  {filteredPresets.map((presetName) => (
                    <CommandItem
                      key={presetName}
                      onSelect={() => {
                        onPresetChange(presetName);
                        setSearch("");
                      }}
                      className="flex items-center gap-2 py-2.5"
                    >
                      <div className="flex gap-0.5 mr-2">
                        <ColorBox
                          color={getPresetThemeStyles(presetName)[mode].primary}
                        />
                        <ColorBox
                          color={getPresetThemeStyles(presetName)[mode].accent}
                        />
                        <ColorBox
                          color={getPresetThemeStyles(presetName)[mode].secondary}
                        />
                        <ColorBox
                          color={getPresetThemeStyles(presetName)[mode].border}
                        />
                      </div>
                      <span className="flex-1 capitalize text-sm font-medium">
                        {presetName.replace(/-/g, " ")}
                      </span>
                      {presetName === value && (
                        <Check className="h-4 w-4 shrink-0 opacity-70" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </TooltipProvider>

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        title="Previous theme"
        onClick={() => cycleTheme("prev")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        title="Next theme"
        onClick={() => cycleTheme("next")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ThemePresetSelect;
