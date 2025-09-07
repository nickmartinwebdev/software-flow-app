export interface AcceptanceCriteria {
  id: string;
  description: string;
  gherkinScenario: string;
  priority: 'must' | 'should' | 'could' | 'wont';
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  asA: string; // As a [role]
  iWant: string; // I want [goal]
  soThat: string; // So that [benefit]
  acceptanceCriteria: AcceptanceCriteria[];
  priority: 'urgent' | 'high' | 'normal' | 'low';
  complexity: number; // Story points (1-13)
  businessValue: number; // 1-10
  riskLevel: 'low' | 'medium' | 'high';
  status: 'draft' | 'refined' | 'approved' | 'in-development' | 'done';
  epicId?: string;
  dependencies: string[];
  tags: string[];
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
  revisionHistory: StoryRevision[];
}

export interface StoryRevision {
  id: string;
  version: number;
  changes: string[];
  feedback: string;
  revisedBy: string;
  revisedAt: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  businessGoal: string;
  successCriteria: string[];
  userStories: string[]; // Story IDs
  priority: 'urgent' | 'high' | 'normal' | 'low';
  businessValue: number; // 1-10
  complexity: number; // Aggregated from stories
  status: 'draft' | 'refined' | 'approved' | 'in-development' | 'done';
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: string[];
  targetRelease?: string;
  estimatedDuration?: number; // weeks
  stakeholders: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RequirementContext {
  domain: string;
  industry: string;
  technicalConstraints: string[];
  businessContext: string;
  targetAudience: string;
  regulations: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export interface RefinementSession {
  id: string;
  type: 'story' | 'epic';
  itemId: string;
  participants: string[];
  feedback: SessionFeedback[];
  decisions: string[];
  actionItems: ActionItem[];
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledAt: string;
  completedAt?: string;
}

export interface SessionFeedback {
  participant: string;
  comment: string;
  type: 'question' | 'suggestion' | 'concern' | 'approval';
  timestamp: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  epics: Epic[];
  userStories: UserStory[];
  context: RequirementContext;
  team: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export type ViewMode = 'epics' | 'stories' | 'backlog' | 'dependencies';
export type FilterCriteria = {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  epic?: string[];
  complexity?: [number, number];
  businessValue?: [number, number];
};
