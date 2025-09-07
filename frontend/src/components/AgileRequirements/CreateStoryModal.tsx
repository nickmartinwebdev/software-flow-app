import { useState } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  NumberInput,
  MultiSelect,
  Grid,
  Text,
  Card,
  ActionIcon,
  Divider,
  Tabs,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconPlus,
  IconTrash,
  IconUser,
  IconTarget,
  IconCheck,
} from "@tabler/icons-react";
import { Epic, UserStory, AcceptanceCriteria } from "../../types/agile";

interface CreateStoryModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (story: Omit<UserStory, "id" | "createdAt" | "updatedAt">) => void;
  epics: Epic[];
  existingStories: UserStory[];
}

export function CreateStoryModal({
  opened,
  onClose,
  onSubmit,
  epics,
  existingStories,
}: CreateStoryModalProps) {
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<
    Omit<AcceptanceCriteria, "id">[]
  >([
    {
      description: "",
      gherkinScenario: "",
      priority: "must",
    },
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("story");

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      asA: "",
      iWant: "",
      soThat: "",
      priority: "normal" as UserStory["priority"],
      complexity: 1,
      businessValue: 5,
      riskLevel: "medium" as UserStory["riskLevel"],
      status: "draft" as UserStory["status"],
      epicId: "",
      dependencies: [] as string[],
      estimatedHours: undefined as number | undefined,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      asA: (value) => (!value ? "User role is required" : null),
      iWant: (value) => (!value ? "User goal is required" : null),
      soThat: (value) => (!value ? "User benefit is required" : null),
      businessValue: (value) =>
        value < 1 || value > 10
          ? "Business value must be between 1 and 10"
          : null,
      complexity: (value) =>
        value < 1 || value > 13
          ? "Complexity must be between 1 and 13 story points"
          : null,
    },
  });

  const priorityOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "normal", label: "Normal" },
    { value: "low", label: "Low" },
  ];

  const riskOptions = [
    { value: "low", label: "Low Risk" },
    { value: "medium", label: "Medium Risk" },
    { value: "high", label: "High Risk" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "refined", label: "Refined" },
    { value: "approved", label: "Approved" },
  ];

  const complexityOptions = [
    { value: "1", label: "1 - Very Simple" },
    { value: "2", label: "2 - Simple" },
    { value: "3", label: "3 - Easy" },
    { value: "5", label: "5 - Medium" },
    { value: "8", label: "8 - Hard" },
    { value: "13", label: "13 - Very Hard" },
  ];

  const criteriaOptions = [
    { value: "must", label: "Must Have" },
    { value: "should", label: "Should Have" },
    { value: "could", label: "Could Have" },
    { value: "wont", label: "Won't Have" },
  ];

  const epicOptions = epics.map((epic) => ({
    value: epic.id,
    label: epic.title,
  }));

  const dependencyOptions = existingStories.map((story) => ({
    value: story.id,
    label: story.title,
  }));

  const tagOptions = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "api", label: "API" },
    { value: "ui/ux", label: "UI/UX" },
    { value: "database", label: "Database" },
    { value: "security", label: "Security" },
    { value: "performance", label: "Performance" },
    { value: "testing", label: "Testing" },
    { value: "documentation", label: "Documentation" },
  ];

  const addAcceptanceCriteria = () => {
    setAcceptanceCriteria([
      ...acceptanceCriteria,
      {
        description: "",
        gherkinScenario: "",
        priority: "must",
      },
    ]);
  };

  const updateAcceptanceCriteria = (
    index: number,
    field: keyof Omit<AcceptanceCriteria, "id">,
    value: string,
  ) => {
    const newCriteria = [...acceptanceCriteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setAcceptanceCriteria(newCriteria);
  };

  const removeAcceptanceCriteria = (index: number) => {
    if (acceptanceCriteria.length > 1) {
      setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    const filteredCriteria = acceptanceCriteria
      .filter((criteria) => criteria.description.trim() !== "")
      .map((criteria, index) => ({
        ...criteria,
        id: `criteria-${Date.now()}-${index}`,
      }));

    const story: Omit<UserStory, "id" | "createdAt" | "updatedAt"> = {
      ...values,
      acceptanceCriteria: filteredCriteria,
      tags,
      revisionHistory: [],
    };

    onSubmit(story);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setAcceptanceCriteria([
      {
        description: "",
        gherkinScenario: "",
        priority: "must",
      },
    ]);
    setTags([]);
    setActiveTab("story");
    onClose();
  };

  const generateGherkinTemplate = (index: number) => {
    const criteria = acceptanceCriteria[index];
    if (!criteria.description) return;

    const template = `Given [precondition]
When [action]
Then [expected result]`;

    updateAcceptanceCriteria(index, "gherkinScenario", template);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New User Story"
      size="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="story" leftSection={<IconUser size={14} />}>
              Story Details
            </Tabs.Tab>
            <Tabs.Tab value="criteria" leftSection={<IconCheck size={14} />}>
              Acceptance Criteria
            </Tabs.Tab>
            <Tabs.Tab value="planning" leftSection={<IconTarget size={14} />}>
              Planning & Assessment
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="story" pt="md">
            <Stack gap="md">
              {/* Basic Story Information */}
              <Card withBorder p="md">
                <Text size="sm" fw={600} mb="md">
                  Basic Information
                </Text>

                <Stack gap="md">
                  <TextInput
                    label="Story Title"
                    placeholder="Enter a concise, descriptive title"
                    required
                    {...form.getInputProps("title")}
                  />

                  <Textarea
                    label="Description (Optional)"
                    placeholder="Additional context or details"
                    rows={2}
                    {...form.getInputProps("description")}
                  />
                </Stack>
              </Card>

              {/* User Story Format */}
              <Card withBorder p="md">
                <Text size="sm" fw={600} mb="md">
                  User Story Format
                </Text>

                <Stack gap="md">
                  <TextInput
                    label="As a..."
                    placeholder="user role or persona"
                    required
                    {...form.getInputProps("asA")}
                  />

                  <TextInput
                    label="I want to..."
                    placeholder="goal or functionality"
                    required
                    {...form.getInputProps("iWant")}
                  />

                  <TextInput
                    label="So that..."
                    placeholder="benefit or value"
                    required
                    {...form.getInputProps("soThat")}
                  />

                  {/* Story Preview */}
                  {(form.values.asA ||
                    form.values.iWant ||
                    form.values.soThat) && (
                    <Card
                      withBorder
                      p="sm"
                      style={{ backgroundColor: "var(--mantine-color-gray-0)" }}
                    >
                      <Text size="sm" fw={500} mb="xs">
                        Story Preview:
                      </Text>
                      <Text size="sm" c="dimmed">
                        <strong>As a</strong> {form.values.asA || "[role]"},{" "}
                        <strong>I want</strong> {form.values.iWant || "[goal]"},{" "}
                        <strong>so that</strong>{" "}
                        {form.values.soThat || "[benefit]"}
                      </Text>
                    </Card>
                  )}
                </Stack>
              </Card>

              {/* Tags */}
              <Card withBorder p="md">
                <Text size="sm" fw={600} mb="md">
                  Tags
                </Text>
                <MultiSelect
                  placeholder="Select or add custom tags"
                  data={tagOptions}
                  value={tags}
                  onChange={setTags}
                  searchable
                />
              </Card>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="criteria" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text size="lg" fw={600}>
                  Acceptance Criteria
                </Text>
                <Button
                  size="sm"
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={addAcceptanceCriteria}
                >
                  Add Criteria
                </Button>
              </Group>

              <Stack gap="md">
                {acceptanceCriteria.map((criteria, index) => (
                  <Card key={index} withBorder p="md">
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>
                          Criteria #{index + 1}
                        </Text>
                        <Group gap="xs">
                          <Select
                            data={criteriaOptions}
                            value={criteria.priority}
                            onChange={(value) =>
                              updateAcceptanceCriteria(
                                index,
                                "priority",
                                value as any,
                              )
                            }
                            style={{ width: 120 }}
                            size="xs"
                          />
                          <ActionIcon
                            color="red"
                            variant="light"
                            size="sm"
                            onClick={() => removeAcceptanceCriteria(index)}
                            disabled={acceptanceCriteria.length === 1}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                      </Group>

                      <Textarea
                        placeholder="Describe what needs to be accomplished"
                        value={criteria.description}
                        onChange={(e) =>
                          updateAcceptanceCriteria(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        rows={2}
                      />

                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="xs" c="dimmed">
                            Gherkin Scenario (Optional)
                          </Text>
                          <Button
                            size="xs"
                            variant="subtle"
                            onClick={() => generateGherkinTemplate(index)}
                          >
                            Generate Template
                          </Button>
                        </Group>
                        <Textarea
                          placeholder="Given... When... Then..."
                          value={criteria.gherkinScenario}
                          onChange={(e) =>
                            updateAcceptanceCriteria(
                              index,
                              "gherkinScenario",
                              e.target.value,
                            )
                          }
                          rows={3}
                          ff="monospace"
                          size="xs"
                        />
                      </div>
                    </Stack>
                  </Card>
                ))}
              </Stack>

              {acceptanceCriteria.length === 0 && (
                <Card withBorder p="xl" ta="center">
                  <IconCheck size={48} stroke={1} color="gray" />
                  <Text size="lg" fw={500} mt="md">
                    No acceptance criteria
                  </Text>
                  <Text size="sm" c="dimmed" mb="md">
                    Add criteria to define when this story is complete
                  </Text>
                  <Button onClick={addAcceptanceCriteria}>
                    Add First Criteria
                  </Button>
                </Card>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="planning" pt="md">
            <Stack gap="md">
              {/* Priority and Assessment */}
              <Card withBorder p="md">
                <Text size="sm" fw={600} mb="md">
                  Priority & Assessment
                </Text>

                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      label="Priority"
                      data={priorityOptions}
                      {...form.getInputProps("priority")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Select
                      label="Risk Level"
                      data={riskOptions}
                      {...form.getInputProps("riskLevel")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <NumberInput
                      label="Business Value"
                      description="1 (lowest) to 10 (highest)"
                      min={1}
                      max={10}
                      {...form.getInputProps("businessValue")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Select
                      label="Story Points"
                      description="Fibonacci sequence for complexity"
                      data={complexityOptions}
                      value={form.values.complexity.toString()}
                      onChange={(value) =>
                        form.setFieldValue("complexity", parseInt(value || "1"))
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Card>

              {/* Planning Details */}
              <Card withBorder p="md">
                <Text size="sm" fw={600} mb="md">
                  Planning Details
                </Text>

                <Stack gap="md">
                  <Grid>
                    <Grid.Col span={6}>
                      <Select
                        label="Initial Status"
                        data={statusOptions}
                        {...form.getInputProps("status")}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <NumberInput
                        label="Estimated Hours"
                        description="Optional time estimate"
                        min={0}
                        step={0.5}
                        {...form.getInputProps("estimatedHours")}
                      />
                    </Grid.Col>
                  </Grid>

                  <Select
                    label="Epic Association"
                    placeholder="Select an epic (optional)"
                    data={[{ value: "", label: "No Epic" }, ...epicOptions]}
                    {...form.getInputProps("epicId")}
                    clearable
                  />

                  <MultiSelect
                    label="Dependencies"
                    placeholder="Select dependent user stories"
                    data={dependencyOptions}
                    {...form.getInputProps("dependencies")}
                    searchable
                  />
                </Stack>
              </Card>

              {/* Summary */}
              <Card
                withBorder
                p="md"
                style={{ backgroundColor: "var(--mantine-color-blue-0)" }}
              >
                <Text size="sm" fw={600} mb="md">
                  Story Summary
                </Text>
                <Grid>
                  <Grid.Col span={3}>
                    <Text size="xs" c="dimmed">
                      Complexity
                    </Text>
                    <Badge color="orange" variant="light">
                      {form.values.complexity} pts
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text size="xs" c="dimmed">
                      Business Value
                    </Text>
                    <Badge color="blue" variant="light">
                      {form.values.businessValue}/10
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text size="xs" c="dimmed">
                      Acceptance Criteria
                    </Text>
                    <Badge color="green" variant="light">
                      {
                        acceptanceCriteria.filter((c) => c.description.trim())
                          .length
                      }
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text size="xs" c="dimmed">
                      Dependencies
                    </Text>
                    <Badge color="grape" variant="light">
                      {form.values.dependencies.length}
                    </Badge>
                  </Grid.Col>
                </Grid>
              </Card>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Divider my="md" />

        {/* Actions */}
        <Group justify="flex-end">
          <Button variant="light" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!form.isValid()}>
            Create User Story
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
