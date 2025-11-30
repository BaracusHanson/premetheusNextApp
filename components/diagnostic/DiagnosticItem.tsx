"use client";

import { FormQuestion, QuestionSubField } from "@/lib/formSteps";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DiagnosticItemProps {
    question: FormQuestion | QuestionSubField;
    answers: Record<string, any>;
    onChange: (fieldId: string, value: any) => void;
    level?: number;
}

export function DiagnosticItem({ question, answers, onChange, level = 0 }: DiagnosticItemProps) {
    const value = answers[question.id];

    // Check condition
    if (question.condition && !question.condition(answers)) {
        return null;
    }

    const handleChange = (val: any) => {
        onChange(question.id, val);
    };

    const renderInput = () => {
        switch (question.type) {
            case "text":
                return (
                    <Input
                        value={value || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder={question.placeholder}
                    />
                );
            case "number":
                return (
                    <Input
                        type="number"
                        value={value || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder={question.placeholder}
                    />
                );
            case "textarea":
                return (
                    <Textarea
                        value={value || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder={question.placeholder}
                        className="min-h-[100px]"
                    />
                );
            case "select":
                return (
                    <Select value={value || ""} onValueChange={handleChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            {question.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case "date":
                return (
                    <Input
                        type="date"
                        value={value || ""}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                );
            case "boolean":
                // We can use a Switch or a customized toggle
                // Let's use a nice Yes/No toggle group look-alike using buttons for clarity?
                // Or a Switch. Let's stick to Switch for simplicity or the previous Toggle.
                // Actually, for "Yes/No" questions, a Select or two buttons is often clearer than a switch.
                // Let's use a standard Select for Boolean to avoid ambiguity (Yes/No)
                return (
                     <Select value={value ? String(value) : ""} onValueChange={(val) => handleChange(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Oui</SelectItem>
                            <SelectItem value="false">Non</SelectItem>
                        </SelectContent>
                    </Select>
                );
            default:
                return null;
        }
    };

    // Determine styles based on nesting level
    const containerClass = level === 0 
        ? "p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-4"
        : "pl-4 border-l-2 border-primary/20 space-y-3 mt-4";

    return (
        <div className={cn(containerClass, "animate-in fade-in slide-in-from-top-1")}>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                    <Label className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", level === 0 ? "text-base" : "text-sm")}>
                        {question.label}
                        {question.required && <span className="text-primary ml-1">*</span>}
                    </Label>
                </div>
                {question.helpText && (
                    <p className="text-[0.8rem] text-muted-foreground">
                        {question.helpText}
                    </p>
                )}
            </div>

            <div className="relative">
                {renderInput()}
            </div>

            {/* Render SubQuestions if any */}
            {'subQuestions' in question && question.subQuestions && question.subQuestions.length > 0 && (
                <div className="space-y-4 pt-2">
                    {question.subQuestions.map(subQ => (
                        <DiagnosticItem 
                            key={subQ.id} 
                            question={subQ} 
                            answers={answers} 
                            onChange={onChange}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

