import { z } from "zod";
import { formSteps } from "./formSteps";

export function getStepSchema(stepId: string) {
  const step = formSteps.find((s) => s.id === stepId);
  if (!step) return z.object({});

  const shape: Record<string, z.ZodTypeAny> = {};

  step.questions.forEach((question) => {
    let validator: z.ZodTypeAny;

    switch (question.type) {
      case "date":
        validator = z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
            message: "Date invalide",
        });
        break;
      case "number":
        validator = z.coerce.number();
        break;
      case "select":
        validator = z.string().min(1, "Veuillez sélectionner une option");
        break;
      default: // text, textarea
        validator = z.string();
        break;
    }

    if (question.required) {
        if (question.type === 'text' || question.type === 'textarea') {
             validator = (validator as z.ZodString).min(1, "Ce champ est requis");
        }
    } else {
        validator = validator.optional().or(z.literal(''));
    }

    shape[question.id] = validator;
  });

  return z.object(shape);
}
