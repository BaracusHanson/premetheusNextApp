"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormStep } from "@/lib/formSteps";
import { getStepSchema } from "@/lib/formSchema";
import { Stepper } from "@/components/form/Stepper";
import { FormCard } from "@/components/form/FormCard";
import { QuestionBlock } from "@/components/form/QuestionBlock";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContinueButton } from "@/components/form/ContinueButton";
import { PreviousButton } from "@/components/form/PreviousButton";
import { AutoSaveIndicator } from "@/components/form/AutoSaveIndicator";
import { ConditionalField } from "@/components/form/ConditionalField";
import { formSteps } from "@/lib/formSteps";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormPageClientProps {
  stepId: string;
  initialData: any;
  allAnswers: any; // For cross-step conditions
  userId: string;
  fieldHints?: Record<string, { title: string; xp: number; status: string }[]>;
}

export default function FormPageClient({ stepId, initialData, allAnswers, fieldHints = {} }: FormPageClientProps) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  
  const step = formSteps.find(s => s.id === stepId);
  if (!step) return <div>Step not found</div>;

  const schema = getStepSchema(step.id);
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
    mode: "onChange"
  });

  // Watch all fields for conditions and autosave
  const watchedValues = watch();
  
  // Merge current form values with all previous answers for condition checking
  const currentAnswers = { ...allAnswers, ...watchedValues };

  const [notification, setNotification] = useState<{ title: string, message: string, type: 'quest' | 'badge' } | null>(null);

  const handleSaveResponse = (data: any) => {
      if (data.newQuests && data.newQuests.length > 0) {
          // Show notification for the first one (simplified)
          setNotification({ title: "Quête Terminée !", message: `Vous avez complété : ${data.newQuests[0].title}`, type: 'quest' });
          setTimeout(() => setNotification(null), 4000);
      } else if (data.newBadges && data.newBadges.length > 0) {
           setNotification({ title: "Badge Débloqué !", message: `Vous avez obtenu : ${data.newBadges[0].name}`, type: 'badge' });
           setTimeout(() => setNotification(null), 4000);
      }
  };

  // Autosave Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (Object.keys(watchedValues).length > 0) {
            setSaveStatus("saving");
            try {
                const res = await fetch("/form/api/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stepId: step.id, answers: watchedValues }),
                });
                const data = await res.json();
                handleSaveResponse(data);
                
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
            } catch (error) {
                setSaveStatus("error");
            }
        }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timer);
  }, [watchedValues, step.id]);

  const onSubmit = async (data: any) => {
    // Final save before moving
    setSaveStatus("saving");
    const res = await fetch("/form/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: step.id, answers: data }),
    });
    const resData = await res.json();
    handleSaveResponse(resData); // Use resData instead of data
    
    setSaveStatus("saved");

    // Navigate to next step
    const currentIndex = formSteps.findIndex(s => s.id === step.id);
    if (currentIndex < formSteps.length - 1) {
        router.push(`/form/${formSteps[currentIndex + 1].id}`);
    } else {
        router.push("/dashboard"); // Or completion page
    }
  };

  const onPrevious = () => {
    const currentIndex = formSteps.findIndex(s => s.id === step.id);
    if (currentIndex > 0) {
        router.push(`/form/${formSteps[currentIndex - 1].id}`);
    } else {
        router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-muted-foreground hover:text-foreground">
              <X className="mr-2 h-4 w-4" />
              Quitter vers Dashboard
          </Button>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <Stepper currentStepId={step.id} />
        
        <FormCard>
          <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
              {step.description && <p className="text-muted-foreground mt-2">{step.description}</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step.questions.map((question) => {
                // Check condition
                const isVisible = question.condition ? question.condition(currentAnswers) : true;
                
                const hints = fieldHints[question.id];
                const isLocked = hints?.some(h => h.status === 'COMPLETED');

                return (
                    <ConditionalField key={question.id} show={isVisible}>
                        <QuestionBlock 
                            id={question.id} 
                            label={question.label} 
                            helpText={question.helpText}
                            error={errors[question.id]?.message as string}
                            questHints={hints}
                        >
                            {question.type === 'text' && (
                                <Input {...register(question.id)} placeholder={question.placeholder} disabled={isLocked} />
                            )}
                            {question.type === 'number' && (
                                <Input type="number" {...register(question.id)} placeholder={question.placeholder} disabled={isLocked} />
                            )}
                            {question.type === 'date' && (
                                <Input type="date" {...register(question.id)} disabled={isLocked} />
                            )}
                            {question.type === 'textarea' && (
                                <Textarea {...register(question.id)} placeholder={question.placeholder} disabled={isLocked} />
                            )}
                            {question.type === 'select' && (
                                <Select 
                                    onValueChange={(value) => setValue(question.id, value, { shouldValidate: true, shouldDirty: true })}
                                    defaultValue={getValues(question.id) || initialData[question.id]}
                                    disabled={isLocked}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {question.options?.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </QuestionBlock>
                    </ConditionalField>
                );
            })}

            <div className="flex justify-between pt-6 border-t">
                <PreviousButton onClick={onPrevious} />
                <ContinueButton /> 
            </div>
          </form>
        </FormCard>
      </div>
      <AutoSaveIndicator status={saveStatus} />
      
      {notification && (
          <div className="fixed bottom-20 right-6 z-50 p-4 bg-surface border border-primary/20 bg-white dark:bg-slate-900 rounded-lg shadow-xl animate-in slide-in-from-bottom-5 flex flex-col gap-3 max-w-md">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary text-xl">
                    {notification.type === 'quest' ? '⚔️' : '🏆'}
                </div>
                <div>
                    <h4 className="font-bold text-foreground">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-1">
                  <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} className="text-xs h-8">
                      Voir Dashboard
                  </Button>
              </div>
          </div>
      )}
    </div>
  );
}
