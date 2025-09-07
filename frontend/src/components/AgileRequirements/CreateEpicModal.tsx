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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Epic } from "../../types/agile";

interface CreateEpicModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (epic: Omit<Epic, "id" | "createdAt" | "updatedAt">) => void;
  existingEpics: Epic[];
}

export function CreateEpicModal({
  opened,
  onClose,
  onSubmit,
  existingEpics,
}: CreateEpicModalProps) {
  const [successCriteria, setSuccessCriteria] = useState<string[]>([""]);
  const [stakeholders, setStakeholders] = useState<string[]>([""]);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      businessGoal: "",
      priority: "normal" as Epic["priority"],
      businessValue: 5,
      complexity: 1,
      riskLevel: "medium" as Epic["riskLevel"],
      status: "draft" as Epic["status"],
      dependencies: [] as string[],
      targetRelease: "",
      estimatedDuration: undefined as number | undefined,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      businessGoal: (value) => (!value ? "Business goal is required" : null),
      businessValue: (value) =>
        value < 1 || value > 10
          ? "Business value must be between 1 and 10"
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

  const dependencyOptions = existingEpics.map((epic) => ({
    value: epic.id,
    label: epic.title,
  }));

  const addSuccessCriteria = () => {
    setSuccessCriteria([...successCriteria, ""]);
  };

  const updateSuccessCriteria = (index: number, value: string) => {
    const newCriteria = [...successCriteria];
    newCriteria[index] = value;
    setSuccessCriteria(newCriteria);
  };

  const removeSuccessCriteria = (index: number) => {
    if (successCriteria.length > 1) {
      setSuccessCriteria(successCriteria.filter((_, i) => i !== index));
    }
  };

  const addStakeholder = () => {
    setStakeholders([...stakeholders, ""]);
  };

  const updateStakeholder = (index: number, value: string) => {
    const newStakeholders = [...stakeholders];
    newStakeholders[index] = value;
    setStakeholders(newStakeholders);
  };

  const removeStakeholder = (index: number) => {
    if (stakeholders.length > 1) {
      setStakeholders(stakeholders.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    const filteredSuccessCriteria = successCriteria.filter(
      (criteria) => criteria.trim() !== "",
    );
    const filteredStakeholders = stakeholders.filter(
      (stakeholder) => stakeholder.trim() !== "",
    );

    const epic: Omit<Epic, "id" | "createdAt" | "updatedAt"> = {
      ...values,
      successCriteria: filteredSuccessCriteria,
      stakeholders: filteredStakeholders,
      userStories: [],
    };

    onSubmit(epic);
    form.reset();
    setSuccessCriteria([""]);
    setStakeholders([""]);
  };

  const handleClose = () => {
    form.reset();
    setSuccessCriteria([""]);
    setStakeholders([""]);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Epic"
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Basic Information */}
          <Card withBorder p="md">
            <Text size="sm" fw={600} mb="md">
              Basic Information
            </Text>

            <Stack gap="md">
              <TextInput
                label="Epic Title"
                placeholder="Enter a concise, descriptive title"
                required
                {...form.getInputProps("title")}
              />

              <Textarea
                label="Description"
                placeholder="Detailed description of the epic"
                required
                rows={3}
                {...form.getInputProps("description")}
              />

              <Textarea
                label="Business Goal"
                placeholder="What business objective does this epic serve?"
                required
                rows={2}
                {...form.getInputProps("businessGoal")}
              />
            </Stack>
          </Card>

          {/* Success Criteria */}
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>
                Success Criteria
              </Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={addSuccessCriteria}
              >
                Add Criteria
              </Button>
            </Group>

            <Stack gap="sm">
              {successCriteria.map((criteria, index) => (
                <Group key={index} align="flex-start">
                  <TextInput
                    placeholder={`Success criteria ${index + 1}`}
                    value={criteria}
                    onChange={(e) =>
                      updateSuccessCriteria(index, e.target.value)
                    }
                    style={{ flex: 1 }}
                  />
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeSuccessCriteria(index)}
                    disabled={successCriteria.length === 1}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </Card>

          {/* Priority and Metrics */}
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
                  placeholder="1-10"
                  min={1}
                  max={10}
                  {...form.getInputProps("businessValue")}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <NumberInput
                  label="Initial Complexity Estimate"
                  placeholder="Story points"
                  min={1}
                  max={100}
                  {...form.getInputProps("complexity")}
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Planning Information */}
          <Card withBorder p="md">
            <Text size="sm" fw={600} mb="md">
              Planning Information
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
                    label="Estimated Duration (weeks)"
                    placeholder="Optional"
                    min={1}
                    max={52}
                    {...form.getInputProps("estimatedDuration")}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Target Release"
                placeholder="e.g., v2.1, Q1 2024"
                {...form.getInputProps("targetRelease")}
              />

              <MultiSelect
                label="Dependencies"
                placeholder="Select dependent epics"
                data={dependencyOptions}
                {...form.getInputProps("dependencies")}
              />
            </Stack>
          </Card>

          {/* Stakeholders */}
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>
                Stakeholders
              </Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={addStakeholder}
              >
                Add Stakeholder
              </Button>
            </Group>

            <Stack gap="sm">
              {stakeholders.map((stakeholder, index) => (
                <Group key={index} align="flex-start">
                  <TextInput
                    placeholder="Stakeholder name or role"
                    value={stakeholder}
                    onChange={(e) => updateStakeholder(index, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeStakeholder(index)}
                    disabled={stakeholders.length === 1}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </Card>

          <Divider />

          {/* Actions */}
          <Group justify="flex-end">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Epic</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
