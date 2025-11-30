"use client";

import { useState, useCallback, useEffect } from "react";
import { formSteps, FormStep } from "@/lib/formSteps";
import { DiagnosticItem } from "./DiagnosticItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { CelebrationModal, CelebrationItem } from "@/components/CelebrationModal";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface DiagnosticBoardProps {
  initialAnswers: Record<string, any>; // Flattened answers
  defaultTab?: string;
}

export function DiagnosticBoard({ initialAnswers, defaultTab }: DiagnosticBoardProps) {
  const searchParams = useSearchParams();
  const focusField = searchParams.get('focus');

  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [celebrationQueue, setCelebrationQueue] = useState<CelebrationItem[]>([]);

  // Validate defaultTab
  const validTab = formSteps.find(s => s.id === defaultTab) ? defaultTab : formSteps[0].id;

  // Auto-scroll to focused field on mount
  useEffect(() => {
      if (focusField) {
          const element = document.getElementById(`field-${focusField}`);
          if (element) {
              // Small timeout to allow rendering
              setTimeout(() => {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  // Optional: Add a highlight flash
                  element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                  setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);
              }, 300);
          }
      }
  }, [focusField, validTab]);

  // Helper to find stepId for a given fieldId
  const findStepIdForField = (fieldId: string): string => {
      for (const step of formSteps) {
          // Check top level questions
          const q = step.questions.find(q => q.id === fieldId);
          if (q) return step.id;
          
          // Check sub-questions
          for (const question of step.questions) {
              if (question.subQuestions) {
                  const sub = question.subQuestions.find(s => s.id === fieldId);
                  if (sub) return step.id;
              }
          }
      }
      return "general";
  };

  const handleItemChange = useCallback(async (fieldId: string, value: any) => {
    // Update local state immediately
    const newAnswers = { ...answers, [fieldId]: value };
    setAnswers(newAnswers);

    // Find step
    const stepId = findStepIdForField(fieldId);
    const step = formSteps.find(s => s.id === stepId);

    if (!step) return;

    // Prepare data for this step
    const stepData: Record<string, any> = {};
    
    const collectFields = (questions: any[]) => {
        questions.forEach(q => {
            if (newAnswers[q.id] !== undefined) stepData[q.id] = newAnswers[q.id];
            if (q.subQuestions) collectFields(q.subQuestions);
        });
    };
    
    collectFields(step.questions);

    setSaving(prev => ({ ...prev, [stepId]: true }));
    try {
        const res = await fetch('/form/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stepId, answers: stepData })
        });
        
        if (!res.ok) throw new Error("Save failed");
        
        const data = await res.json();
        
        // Process Gamification Rewards
        const newItems: CelebrationItem[] = [];

        if (data.newQuests && data.newQuests.length > 0) {
            data.newQuests.forEach((q: any) => {
                newItems.push({
                    type: 'QUEST',
                    title: q.title,
                    subtitle: 'Quête Complétée',
                    xp: q.xp
                });
            });
        }

        if (data.newBadges && data.newBadges.length > 0) {
            data.newBadges.forEach((b: any) => {
                newItems.push({
                    type: 'BADGE',
                    title: b.name, // Assuming backend returns badge details
                    subtitle: 'Badge Débloqué',
                    xp: b.xp
                });
            });
        }

        if (newItems.length > 0) {
            setCelebrationQueue(prev => [...prev, ...newItems]);
        }

    } catch (err) {
        console.error(err);
    } finally {
        setSaving(prev => ({ ...prev, [stepId]: false }));
    }
  }, [answers]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Votre Inventaire</h2>
            <p className="text-muted-foreground">Complétez votre profil pour avancer dans vos quêtes.</p>
        </div>
      </div>

      <Tabs defaultValue={validTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-2 gap-2 bg-transparent">
            {formSteps.map(step => (
                <TabsTrigger 
                    key={step.id} 
                    value={step.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border px-4 py-2 rounded-full shadow-sm bg-card whitespace-nowrap"
                >
                    {step.title}
                </TabsTrigger>
            ))}
        </TabsList>

        {formSteps.map(step => (
            <TabsContent key={step.id} value={step.id} className="mt-6 animate-in fade-in-50">
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl">{step.title}</CardTitle>
                        <CardDescription className="text-lg">{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                            {step.questions.map(question => (
                                <DiagnosticItem
                                    key={question.id}
                                    question={question}
                                    answers={answers}
                                    onChange={handleItemChange}
                                />
                            ))}
                        </div>
                        <div className="mt-8 flex justify-end">
                             {saving[step.id] && <span className="text-sm text-muted-foreground flex items-center gap-2 animate-pulse"><Save className="w-4 h-4" /> Sauvegarde...</span>}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        ))}
      </Tabs>

      <CelebrationModal 
        queue={celebrationQueue} 
        onClose={() => setCelebrationQueue([])} 
      />
    </div>
  );
}

