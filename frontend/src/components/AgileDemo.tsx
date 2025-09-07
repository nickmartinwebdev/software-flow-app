import { useState } from 'react';
import { RequirementsManagement } from './AgileRequirements/RequirementsManagement';
import { Project, Epic, UserStory, RequirementContext, TeamMember } from '../types/agile';

export function AgileDemo() {
  // Sample project data for demonstration
  const [project, setProject] = useState<Project>({
    id: 'demo-project-1',
    name: 'Customer Portal Modernization',
    description: 'Modernize the existing customer portal with improved UX, mobile responsiveness, and new self-service features',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-20T15:30:00.000Z',
    context: {
      domain: 'web-application',
      industry: 'finance',
      technicalConstraints: ['performance', 'security', 'compliance', 'browser-support'],
      businessContext: 'Replace legacy customer portal to improve customer satisfaction and reduce support costs',
      targetAudience: 'Banking customers aged 25-65, both tech-savvy and traditional users',
      regulations: ['gdpr', 'pci-dss', 'sox']
    } as RequirementContext,
    team: [
      {
        id: 'team-1',
        name: 'Sarah Johnson',
        role: 'Product Owner',
        email: 'sarah.johnson@company.com',
        avatar: undefined
      },
      {
        id: 'team-2',
        name: 'Mike Chen',
        role: 'Scrum Master',
        email: 'mike.chen@company.com',
        avatar: undefined
      },
      {
        id: 'team-3',
        name: 'Emily Rodriguez',
        role: 'UX Designer',
        email: 'emily.rodriguez@company.com',
        avatar: undefined
      },
      {
        id: 'team-4',
        name: 'David Kim',
        role: 'Senior Developer',
        email: 'david.kim@company.com',
        avatar: undefined
      }
    ] as TeamMember[],
    epics: [
      {
        id: 'epic-1',
        title: 'User Authentication & Security',
        description: 'Implement modern authentication system with multi-factor authentication and enhanced security features',
        businessGoal: 'Improve security posture and reduce fraud while maintaining user experience',
        successCriteria: [
          'Reduce login-related support tickets by 40%',
          'Achieve 95% user satisfaction with authentication process',
          'Zero security incidents related to authentication',
          'Support for biometric authentication on mobile devices'
        ],
        userStories: ['story-1', 'story-2', 'story-3'],
        priority: 'urgent',
        businessValue: 9,
        complexity: 21,
        status: 'approved',
        riskLevel: 'medium',
        dependencies: [],
        targetRelease: 'v2.1',
        estimatedDuration: 6,
        stakeholders: ['Security Team', 'Compliance Officer', 'Customer Support Manager'],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-18T14:20:00.000Z'
      },
      {
        id: 'epic-2',
        title: 'Account Management Dashboard',
        description: 'Create comprehensive dashboard for customers to manage their accounts, view transactions, and access services',
        businessGoal: 'Reduce customer support calls by 30% through improved self-service capabilities',
        successCriteria: [
          'Customers can complete 80% of common tasks without calling support',
          'Dashboard loads within 2 seconds on all devices',
          'Mobile usage increases by 50%',
          'Customer satisfaction score improves to 4.5/5'
        ],
        userStories: ['story-4', 'story-5', 'story-6', 'story-7'],
        priority: 'high',
        businessValue: 8,
        complexity: 34,
        status: 'refined',
        riskLevel: 'low',
        dependencies: ['epic-1'],
        targetRelease: 'v2.2',
        estimatedDuration: 8,
        stakeholders: ['Customer Experience Manager', 'Digital Banking Team', 'Analytics Team'],
        createdAt: '2024-01-16T09:15:00.000Z',
        updatedAt: '2024-01-19T11:45:00.000Z'
      },
      {
        id: 'epic-3',
        title: 'Mobile-First Experience',
        description: 'Redesign entire portal with mobile-first approach, ensuring optimal experience across all devices',
        businessGoal: 'Capture the growing mobile banking market and improve customer engagement',
        successCriteria: [
          'Mobile transactions increase by 60%',
          'App store rating improves to 4.6+',
          'Mobile page load times under 3 seconds',
          'Responsive design passes accessibility audit'
        ],
        userStories: ['story-8', 'story-9'],
        priority: 'high',
        businessValue: 7,
        complexity: 13,
        status: 'draft',
        riskLevel: 'medium',
        dependencies: [],
        targetRelease: 'v2.3',
        estimatedDuration: 4,
        stakeholders: ['Mobile Team', 'UX Designer', 'Accessibility Specialist'],
        createdAt: '2024-01-17T13:30:00.000Z',
        updatedAt: '2024-01-17T13:30:00.000Z'
      }
    ] as Epic[],
    userStories: [
      {
        id: 'story-1',
        title: 'Secure Login with Multi-Factor Authentication',
        description: 'Enable customers to securely access their accounts with modern MFA options',
        asA: 'banking customer',
        iWant: 'to log in securely using multi-factor authentication',
        soThat: 'I can trust that my financial information is protected from unauthorized access',
        acceptanceCriteria: [
          {
            id: 'criteria-1-1',
            description: 'User can enable/disable MFA from security settings',
            gherkinScenario: 'Given I am logged into my account\nWhen I navigate to security settings\nThen I can toggle MFA on or off',
            priority: 'must'
          },
          {
            id: 'criteria-1-2',
            description: 'Support SMS, email, and authenticator app for MFA',
            gherkinScenario: 'Given MFA is enabled\nWhen I log in\nThen I can choose between SMS, email, or authenticator app',
            priority: 'must'
          },
          {
            id: 'criteria-1-3',
            description: 'Remember trusted devices for 30 days',
            gherkinScenario: 'Given I complete MFA on a device\nWhen I mark it as trusted\nThen I won\'t need MFA for 30 days on that device',
            priority: 'should'
          }
        ],
        priority: 'urgent',
        complexity: 8,
        businessValue: 9,
        riskLevel: 'medium',
        status: 'in-development',
        epicId: 'epic-1',
        dependencies: [],
        tags: ['security', 'authentication', 'backend', 'frontend'],
        estimatedHours: 32,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-19T16:15:00.000Z',
        revisionHistory: [
          {
            id: 'rev-1-1',
            version: 1,
            changes: ['Added biometric authentication requirement', 'Updated acceptance criteria'],
            feedback: 'Security team requested biometric support for mobile users',
            revisedBy: 'Sarah Johnson',
            revisedAt: '2024-01-18T14:20:00.000Z'
          }
        ]
      },
      {
        id: 'story-2',
        title: 'Password Recovery and Reset',
        description: 'Allow customers to recover their accounts when they forget passwords',
        asA: 'customer who forgot my password',
        iWant: 'to reset my password securely',
        soThat: 'I can regain access to my account without calling support',
        acceptanceCriteria: [
          {
            id: 'criteria-2-1',
            description: 'Initiate password reset via email or SMS',
            gherkinScenario: 'Given I forgot my password\nWhen I click "Forgot Password"\nThen I can choose email or SMS recovery',
            priority: 'must'
          },
          {
            id: 'criteria-2-2',
            description: 'Reset link expires after 15 minutes',
            gherkinScenario: 'Given I receive a reset link\nWhen more than 15 minutes pass\nThen the link becomes invalid',
            priority: 'must'
          }
        ],
        priority: 'high',
        complexity: 5,
        businessValue: 7,
        riskLevel: 'low',
        status: 'approved',
        epicId: 'epic-1',
        dependencies: [],
        tags: ['security', 'user-management', 'backend'],
        estimatedHours: 20,
        createdAt: '2024-01-15T11:00:00.000Z',
        updatedAt: '2024-01-17T09:30:00.000Z',
        revisionHistory: []
      },
      {
        id: 'story-3',
        title: 'Account Lockout Protection',
        description: 'Protect accounts from brute force attacks with intelligent lockout mechanisms',
        asA: 'system administrator',
        iWant: 'accounts to be protected from brute force attacks',
        soThat: 'customer accounts remain secure while minimizing false lockouts',
        acceptanceCriteria: [
          {
            id: 'criteria-3-1',
            description: 'Lock account after 5 failed attempts within 15 minutes',
            gherkinScenario: 'Given a user fails login 5 times in 15 minutes\nWhen they try again\nThen the account is temporarily locked',
            priority: 'must'
          },
          {
            id: 'criteria-3-2',
            description: 'Send security alert notifications',
            gherkinScenario: 'Given an account is locked due to failed attempts\nWhen the lockout occurs\nThen notify the customer via their preferred method',
            priority: 'should'
          }
        ],
        priority: 'normal',
        complexity: 8,
        businessValue: 8,
        riskLevel: 'low',
        status: 'refined',
        epicId: 'epic-1',
        dependencies: ['story-1'],
        tags: ['security', 'backend', 'monitoring'],
        estimatedHours: 28,
        createdAt: '2024-01-16T08:45:00.000Z',
        updatedAt: '2024-01-18T13:20:00.000Z',
        revisionHistory: []
      },
      {
        id: 'story-4',
        title: 'Account Balance and Transaction History',
        description: 'Display real-time account balance and comprehensive transaction history',
        asA: 'banking customer',
        iWant: 'to view my current balance and recent transactions',
        soThat: 'I can monitor my account activity and manage my finances effectively',
        acceptanceCriteria: [
          {
            id: 'criteria-4-1',
            description: 'Display real-time balance across all account types',
            gherkinScenario: 'Given I log into my dashboard\nWhen the page loads\nThen I see my current balance for all accounts',
            priority: 'must'
          },
          {
            id: 'criteria-4-2',
            description: 'Show transaction history with filtering options',
            gherkinScenario: 'Given I want to view transactions\nWhen I access transaction history\nThen I can filter by date, amount, and category',
            priority: 'must'
          },
          {
            id: 'criteria-4-3',
            description: 'Export transactions to CSV or PDF',
            gherkinScenario: 'Given I need transaction records\nWhen I select export option\nThen I can download CSV or PDF format',
            priority: 'could'
          }
        ],
        priority: 'high',
        complexity: 5,
        businessValue: 9,
        riskLevel: 'low',
        status: 'draft',
        epicId: 'epic-2',
        dependencies: ['story-1'],
        tags: ['dashboard', 'transactions', 'frontend', 'api'],
        estimatedHours: 24,
        createdAt: '2024-01-16T10:00:00.000Z',
        updatedAt: '2024-01-16T10:00:00.000Z',
        revisionHistory: []
      },
      {
        id: 'story-5',
        title: 'Bill Pay and Transfer Services',
        description: 'Enable customers to pay bills and transfer money between accounts',
        asA: 'customer',
        iWant: 'to pay bills and transfer money online',
        soThat: 'I can manage my finances without visiting a branch or calling support',
        acceptanceCriteria: [
          {
            id: 'criteria-5-1',
            description: 'Schedule one-time and recurring bill payments',
            gherkinScenario: 'Given I want to pay a bill\nWhen I set up payment\nThen I can choose one-time or recurring schedule',
            priority: 'must'
          },
          {
            id: 'criteria-5-2',
            description: 'Transfer funds between own accounts instantly',
            gherkinScenario: 'Given I have multiple accounts\nWhen I initiate a transfer\nThen funds move instantly between my accounts',
            priority: 'must'
          }
        ],
        priority: 'high',
        complexity: 13,
        businessValue: 8,
        riskLevel: 'medium',
        status: 'draft',
        epicId: 'epic-2',
        dependencies: ['story-1', 'story-4'],
        tags: ['payments', 'transfers', 'backend', 'security'],
        estimatedHours: 48,
        createdAt: '2024-01-16T14:20:00.000Z',
        updatedAt: '2024-01-16T14:20:00.000Z',
        revisionHistory: []
      },
      {
        id: 'story-6',
        title: 'Personal Finance Insights',
        description: 'Provide customers with spending insights and budgeting tools',
        asA: 'customer',
        iWant: 'to understand my spending patterns',
        soThat: 'I can make better financial decisions and stick to my budget',
        acceptanceCriteria: [
          {
            id: 'criteria-6-1',
            description: 'Categorize transactions automatically',
            gherkinScenario: 'Given I make transactions\nWhen I view my dashboard\nThen transactions are automatically categorized by type',
            priority: 'must'
          },
          {
            id: 'criteria-6-2',
            description: 'Show monthly spending trends and comparisons',
            gherkinScenario: 'Given I have transaction history\nWhen I view insights\nThen I see spending trends compared to previous months',
            priority: 'should'
          }
        ],
        priority: 'normal',
        complexity: 8,
        businessValue: 6,
        riskLevel: 'low',
        status: 'draft',
        epicId: 'epic-2',
        dependencies: ['story-4'],
        tags: ['analytics', 'frontend', 'data-visualization'],
        estimatedHours: 36,
        createdAt: '2024-01-17T09:10:00.000Z',
        updatedAt: '2024-01-17T09:10:00.000Z',
        revisionHistory: []
      },
      {
        id: 'story-7',
        title: 'Customer Support Integration',
        description: 'Integrate support chat and help resources directly in the dashboard',
        asA: 'customer needing help',
        iWant: 'to access support without leaving the portal',
        soThat: 'I can get assistance quickly while maintaining context of my issue',
        acceptanceCriteria: [
          {
            id: 'criteria-7-1',
            description: 'Live chat widget available on all pages',
            gherkinScenario: 'Given I need help on any page\nWhen I look for support\nThen I can access live chat without navigation',
            priority: 'must'
          },
          {
            id: 'criteria-7-2',
            description: 'Context-aware help suggestions',
            gherkinScenario: 'Given I\'m on a specific page\nWhen I open help\nThen I see relevant articles for that page first',
            priority: 'should'
          }
        ],
        priority: 'normal',
        complexity: 8,
        businessValue: 5,
        riskLevel: 'low',
        status: 'draft',
        epicId: 'epic-2',
        dependencies: [],
        tags: ['support', 'chat', 'help', 'frontend'],
        estimatedHours: 32,
        createdAt: '2024-01-17T11:30:00.000Z',
        updatedAt: '2024-01-17T11:30:00.000Z',
        revisionHistory: []
      },
      {
        id: 'story-8',
        title: 'Responsive Design Implementation',
        description: 'Ensure all portal features work seamlessly across mobile, tablet, and desktop devices',
        asA: 'mobile user',
        iWant: 'the portal to work perfectly on my phone',
        soThat: 'I can bank on-the-go with the same functionality as desktop',
        acceptanceCriteria: [
          {
            id: 'criteria-8-1',
            description: 'All features accessible on screens 320px and above',
            gherkinScenario: 'Given I access the portal on mobile\nWhen I use any feature\nThen it works properly on screens 320px and wider',
            priority: 'must'
          },
          {
            id: 'criteria-8-2',
            description: 'Touch-friendly interface with proper tap targets',
            gherkinScenario: 'Given I\'m using touch interface\nWhen I interact with elements\nThen all buttons and links are easily tappable',
            priority: 'must'
          }
        ],
        priority: 'high',
        complexity: 5,
        businessValue: 7,
        riskLevel: 'medium',
        status: 'draft',
        epicId: 'epic-3',
        dependencies: [],
        tags: ['mobile', 'responsive', 'ui/ux', 'frontend'],
        estimatedHours: 40,
        createdAt: '2024-01-17T13:45:00.000Z',
        updatedAt: '2024-01-17T13:45:00.000Z',
        revisionHistory: []
      },
      {
        id: 'story-9',
        title: 'Progressive Web App Features',
        description: 'Add PWA capabilities for offline access and native app-like experience',
        asA: 'frequent mobile user',
        iWant: 'the portal to work like a native app',
        soThat: 'I can access basic banking features even with poor connectivity',
        acceptanceCriteria: [
          {
            id: 'criteria-9-1',
            description: 'Install portal as PWA on mobile devices',
            gherkinScenario: 'Given I visit the portal on mobile\nWhen browser prompts PWA install\nThen I can add it to my home screen',
            priority: 'must'
          },
          {
            id: 'criteria-9-2',
            description: 'Basic offline functionality for viewing balances',
            gherkinScenario: 'Given I lose internet connection\nWhen I open the PWA\nThen I can still view my last known account balance',
            priority: 'should'
          }
        ],
        priority: 'normal',
        complexity: 8,
        businessValue: 6,
        riskLevel: 'high',
        status: 'draft',
        epicId: 'epic-3',
        dependencies: ['story-8'],
        tags: ['pwa', 'offline', 'mobile', 'frontend'],
        estimatedHours: 44,
        createdAt: '2024-01-17T14:00:00.000Z',
        updatedAt: '2024-01-17T14:00:00.000Z',
        revisionHistory: []
      }
    ] as UserStory[]
  });

  const handleUpdateProject = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  return (
    <RequirementsManagement
      project={project}
      onUpdateProject={handleUpdateProject}
    />
  );
}
