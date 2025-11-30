"use client";

import { useState, useCallback } from "react";
import { DIAGNOSTIC_SCHEMA, DiagnosticSectionDef } from "@/lib/diagnostic-schema";
import { DiagnosticItem } from "./DiagnosticItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { QuestCompletionModal } from "@/components/QuestCompletionModal";

interface DiagnosticBoardProps {
  initialAnswers: Record<string, any>; // Flattened answers
  defaultTab?: string;
}

export function DiagnosticBoard({ initialAnswers, defaultTab }: DiagnosticBoardProps) {
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [completedQuest, setCompletedQuest] = useState<any>(null);

  const handleItemChange = useCallback(async (fieldId: string, value: any, date?: string) => {
    // Update local state immediately
    const newAnswers = { ...answers, [fieldId]: value };
    if (date !== undefined) {
      newAnswers[`${fieldId}_date`] = date;
    }
    setAnswers(newAnswers);

    // Find which step this belongs to
    let stepId = "general";
    for (const section of DIAGNOSTIC_SCHEMA) {
        const item = section.items.find(i => i.id === fieldId);
        if (item) {
            stepId = item.stepId;
            break;
        }
    }

    // Prepare data for this step
    const stepData: Record<string, any> = {};
    // We need to find ALL items that belong to this step to preserve them
    // Or we trust that the backend merges? No, backend replaces.
    // So we must gather all known answers for this step from our 'answers' state.
    // But wait, 'answers' state might be incomplete if we only loaded some steps?
    // We should assume 'initialAnswers' loaded EVERYTHING.
    
    // Find all fields for this step from schema
    const fieldsInStep: string[] = [];
    DIAGNOSTIC_SCHEMA.forEach(section => {
        section.items.forEach(item => {
            if (item.stepId === stepId) {
                fieldsInStep.push(item.id);
                // Also include date fields
                fieldsInStep.push(`${item.id}_date`);
            }
        });
    });

    fieldsInStep.forEach(key => {
        if (newAnswers[key] !== undefined) {
            stepData[key] = newAnswers[key];
        }
    });

    // Trigger save
    setSaving(prev => ({ ...prev, [stepId]: true }));
    try {
        const res = await fetch('/form/api/save', { // Corrected path
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stepId, answers: stepData })
        });
        
        if (!res.ok) throw new Error("Save failed");
        
        const data = await res.json();
        if (data.newQuests && data.newQuests.length > 0) {
            // Show the first completed quest
            setCompletedQuest(data.newQuests[0]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setSaving(prev => ({ ...prev, [stepId]: false }));
    }
  }, [answers]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Votre Inventaire</h2>
            <p className="text-muted-foreground">Complétez votre profil pour avancer dans vos quêtes.</p>
        </div>
      </div>

      <Tabs defaultValue={defaultTab || DIAGNOSTIC_SCHEMA[0].id} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-2 gap-2 bg-transparent">
            {DIAGNOSTIC_SCHEMA.map(section => (
                <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border px-4 py-2 rounded-full"
                >
                    {section.title}
                </TabsTrigger>
            ))}
        </TabsList>

        {DIAGNOSTIC_SCHEMA.map(section => (
            <TabsContent key={section.id} value={section.id} className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        {section.items.map(item => (
                            <DiagnosticItem
                                key={item.id}
                                item={item}
                                value={answers[item.id]}
                                dateValue={answers[`${item.id}_date`]}
                                onChange={(val, date) => handleItemChange(item.id, val, date)}
                            />
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
        ))}
      </Tabs>

      <QuestCompletionModal 
        quest={completedQuest} 
        onClose={() => setCompletedQuest(null)} 
      />
    </div>
  );
}
