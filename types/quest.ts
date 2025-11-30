export type QuestDefinition = {
  id: string;
  title: string;
  description: string;
  theme: string;
  xp: number;
  prerequisites: string[];
  status?: string;
  longDescription?: string;
  steps?: string[];
  estimatedTime?: string;
};

export type Quest = QuestDefinition;
