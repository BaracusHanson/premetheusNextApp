"use client";

import { DiagnosticItemDef } from "@/lib/diagnostic-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

// Fallback for missing Switch/Checkbox
function SimpleToggle({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onCheckedChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                checked ? "bg-primary" : "bg-input"
            }`}
        >
            <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                    checked ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
}

interface DiagnosticItemProps {
    item: DiagnosticItemDef;
    value: any;
    dateValue?: string;
    onChange: (value: any, date?: string) => void;
}

export function DiagnosticItem({ item, value, dateValue, onChange }: DiagnosticItemProps) {
    const [localValue, setLocalValue] = useState(value);
    const [localDate, setLocalDate] = useState(dateValue || "");

    // Sync local state with prop, but allow local edits
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        setLocalDate(dateValue || "");
    }, [dateValue]);

    const handleValueChange = (val: any) => {
        setLocalValue(val);
        onChange(val, localDate);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setLocalDate(newDate);
        onChange(localValue, newDate);
    };

    return (
        <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium">{item.label}</Label>
                {item.type === 'boolean' && (
                    <SimpleToggle 
                        checked={localValue === 'true' || localValue === true} 
                        onCheckedChange={(checked) => handleValueChange(checked ? 'true' : 'false')} 
                    />
                )}
            </div>

            <div className="space-y-3">
                {item.type === 'text' && (
                    <Input 
                        value={localValue || ''} 
                        onChange={(e) => handleValueChange(e.target.value)}
                        placeholder={item.placeholder}
                    />
                )}

                {item.type === 'select' && item.options && (
                    <Select value={localValue || ''} onValueChange={handleValueChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            {item.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {item.type === 'date' && (
                    <Input 
                        type="date" 
                        value={localValue || ''} 
                        onChange={(e) => handleValueChange(e.target.value)} 
                    />
                )}

                {/* Conditional Date Input */}
                {(item.requiresDate || (item.type === 'boolean' && item.requiresDate)) && (localValue === 'true' || localValue === true || (item.type === 'select' && localValue && localValue !== 'none')) && (
                    <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                        <Label className="text-xs text-muted-foreground mb-1 block">Date (Optionnel)</Label>
                        <Input 
                            type="date" 
                            value={localDate} 
                            onChange={handleDateChange}
                            className="w-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
