import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QuestionBlockProps {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  questHints?: { title: string; xp: number; status?: string }[];
}

export function QuestionBlock({ id, label, helpText, error, children, className, questHints }: QuestionBlockProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <Label htmlFor={id} className="text-base font-semibold text-foreground">
                {label}
            </Label>
            {questHints && questHints.length > 0 && (
                <div className="flex flex-col items-end gap-1">
                    {questHints.map((hint, idx) => (
                        <div key={idx} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium animate-in fade-in slide-in-from-right-2 ${
                            hint.status === 'COMPLETED' 
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                        }`}>
                            {hint.status === 'COMPLETED' ? (
                                <>
                                    <span className="text-green-600 dark:text-green-400">✅</span>
                                    <span>{hint.title}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-amber-600 dark:text-amber-400">⚡</span>
                                    <span>{hint.title}</span>
                                    <span className="font-bold ml-1">+{hint.xp} XP</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
          </div>
          {helpText && (
              <p className="text-sm text-muted-foreground">{helpText}</p>
          )}
      </div>
      {children}
      {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
