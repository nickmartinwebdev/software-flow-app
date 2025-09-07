import { Stack, Text, TextInput, Textarea, Button, Group, Card, Grid, MultiSelect, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Project } from '../../types/agile';

interface ProjectSettingsProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onClose: () => void;
}

export function ProjectSettings({ project, onUpdateProject, onClose }: ProjectSettingsProps) {
  const form = useForm({
    initialValues: {
      name: project.name,
      description: project.description,
      domain: project.context.domain,
      industry: project.context.industry,
      businessContext: project.context.businessContext,
      targetAudience: project.context.targetAudience,
      technicalConstraints: project.context.technicalConstraints,
      regulations: project.context.regulations,
    },
    validate: {
      name: (value) => (!value ? 'Project name is required' : null),
      description: (value) => (!value ? 'Project description is required' : null),
      domain: (value) => (!value ? 'Domain is required' : null),
      industry: (value) => (!value ? 'Industry is required' : null),
    },
  });

  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'government', label: 'Government' },
    { value: 'non-profit', label: 'Non-Profit' },
    { value: 'other', label: 'Other' },
  ];

  const domainOptions = [
    { value: 'web-application', label: 'Web Application' },
    { value: 'mobile-application', label: 'Mobile Application' },
    { value: 'desktop-application', label: 'Desktop Application' },
    { value: 'api-service', label: 'API Service' },
    { value: 'platform', label: 'Platform' },
    { value: 'system-integration', label: 'System Integration' },
    { value: 'data-analytics', label: 'Data Analytics' },
    { value: 'machine-learning', label: 'Machine Learning' },
  ];

  const constraintOptions = [
    { value: 'performance', label: 'Performance Requirements' },
    { value: 'security', label: 'Security Constraints' },
    { value: 'compliance', label: 'Compliance Requirements' },
    { value: 'scalability', label: 'Scalability Needs' },
    { value: 'integration', label: 'System Integration' },
    { value: 'legacy-support', label: 'Legacy System Support' },
    { value: 'browser-support', label: 'Browser Support' },
    { value: 'mobile-responsive', label: 'Mobile Responsive' },
    { value: 'accessibility', label: 'Accessibility (WCAG)' },
    { value: 'offline-support', label: 'Offline Support' },
  ];

  const regulationOptions = [
    { value: 'gdpr', label: 'GDPR (General Data Protection Regulation)' },
    { value: 'hipaa', label: 'HIPAA (Health Insurance Portability)' },
    { value: 'sox', label: 'SOX (Sarbanes-Oxley Act)' },
    { value: 'pci-dss', label: 'PCI DSS (Payment Card Industry)' },
    { value: 'ferpa', label: 'FERPA (Family Educational Rights)' },
    { value: 'ccpa', label: 'CCPA (California Consumer Privacy Act)' },
    { value: 'iso-27001', label: 'ISO 27001' },
    { value: 'fda', label: 'FDA Regulations' },
  ];

  const handleSubmit = (values: typeof form.values) => {
    const updatedProject: Project = {
      ...project,
      name: values.name,
      description: values.description,
      context: {
        ...project.context,
        domain: values.domain,
        industry: values.industry,
        businessContext: values.businessContext,
        targetAudience: values.targetAudience,
        technicalConstraints: values.technicalConstraints,
        regulations: values.regulations,
      },
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    onClose();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        {/* Basic Project Information */}
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="md">Basic Information</Text>

          <Stack gap="md">
            <TextInput
              label="Project Name"
              placeholder="Enter project name"
              required
              {...form.getInputProps('name')}
            />

            <Textarea
              label="Project Description"
              placeholder="Brief description of the project"
              required
              rows={3}
              {...form.getInputProps('description')}
            />
          </Stack>
        </Card>

        {/* Context Information */}
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="md">Project Context</Text>

          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Domain"
                  placeholder="Select project domain"
                  data={domainOptions}
                  required
                  searchable
                  {...form.getInputProps('domain')}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <Select
                  label="Industry"
                  placeholder="Select industry"
                  data={industryOptions}
                  required
                  searchable
                  {...form.getInputProps('industry')}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Business Context"
              placeholder="Describe the business context and objectives"
              rows={3}
              {...form.getInputProps('businessContext')}
            />

            <TextInput
              label="Target Audience"
              placeholder="Who are the primary users?"
              {...form.getInputProps('targetAudience')}
            />
          </Stack>
        </Card>

        {/* Technical Constraints */}
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="md">Technical Constraints</Text>

          <MultiSelect
            label="Technical Constraints"
            placeholder="Select applicable constraints"
            data={constraintOptions}
            value={form.values.technicalConstraints}
            onChange={(value) => form.setFieldValue('technicalConstraints', value)}
            searchable
            clearable
          />
        </Card>

        {/* Regulatory Requirements */}
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="md">Regulatory Requirements</Text>

          <MultiSelect
            label="Applicable Regulations"
            placeholder="Select regulatory requirements"
            data={regulationOptions}
            value={form.values.regulations}
            onChange={(value) => form.setFieldValue('regulations', value)}
            searchable
            clearable
          />
        </Card>

        {/* Team Information */}
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="md">Team Information</Text>

          <Stack gap="xs">
            <Text size="sm" c="dimmed">Current team members: {project.team.length}</Text>
            {project.team.map((member, index) => (
              <Group key={index} justify="space-between">
                <div>
                  <Text size="sm" fw={500}>{member.name}</Text>
                  <Text size="xs" c="dimmed">{member.role} • {member.email}</Text>
                </div>
              </Group>
            ))}
            <Button variant="subtle" size="sm" mt="sm">
              Manage Team Members
            </Button>
          </Stack>
        </Card>

        {/* Actions */}
        <Group justify="flex-end">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Settings
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
