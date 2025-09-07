import {
  Stack,
  Text,
  Grid,
  Badge,
  Card,
  Group,
  Button,
  Divider,
} from "@mantine/core";
import { Epic, UserStory } from "../../types/agile";

interface EpicDetailsProps {
  epic: Epic;
  userStories: UserStory[];
  onUpdate: (epic: Epic) => void;
}

export function EpicDetails({ epic, userStories }: EpicDetailsProps) {
  const getStatusColor = (status: Epic["status"]) => {
    switch (status) {
      case "draft":
        return "gray";
      case "refined":
        return "blue";
      case "approved":
        return "green";
      case "in-development":
        return "orange";
      case "done":
        return "green";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority: Epic["priority"]) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "normal":
        return "blue";
      case "low":
        return "gray";
      default:
        return "gray";
    }
  };

  const getRiskColor = (risk: Epic["riskLevel"]) => {
    switch (risk) {
      case "high":
        return "red";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Stack gap="md">
      {/* Epic Header */}
      <Group gap="md" mb="md">
        <Badge color={getStatusColor(epic.status)} size="lg">
          {epic.status}
        </Badge>
        <Badge color={getPriorityColor(epic.priority)} size="lg">
          {epic.priority}
        </Badge>
        <Badge color={getRiskColor(epic.riskLevel)} size="lg">
          {epic.riskLevel} risk
        </Badge>
      </Group>

      {/* Description */}
      <Card withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Description
        </Text>
        <Text size="sm" c="dimmed">
          {epic.description}
        </Text>
      </Card>

      {/* Business Goal */}
      <Card withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Business Goal
        </Text>
        <Text size="sm" c="dimmed">
          {epic.businessGoal}
        </Text>
      </Card>

      {/* Success Criteria */}
      <Card withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Success Criteria
        </Text>
        <Stack gap="xs">
          {epic.successCriteria.map((criteria, index) => (
            <Text key={index} size="sm" c="dimmed">
              • {criteria}
            </Text>
          ))}
        </Stack>
      </Card>

      {/* Metrics */}
      <Grid>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Business Value
            </Text>
            <Text size="xl" fw={600}>
              {epic.businessValue}/10
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Complexity
            </Text>
            <Text size="xl" fw={600}>
              {epic.complexity}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              User Stories
            </Text>
            <Text size="xl" fw={600}>
              {userStories.length}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Stakeholders
            </Text>
            <Text size="xl" fw={600}>
              {epic.stakeholders.length}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Stakeholders */}
      <Card withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Stakeholders
        </Text>
        <Group gap="xs">
          {epic.stakeholders.map((stakeholder, index) => (
            <Badge key={index} variant="light" color="blue">
              {stakeholder}
            </Badge>
          ))}
        </Group>
      </Card>

      {/* Related Stories */}
      {userStories.length > 0 && (
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="sm">
            Related User Stories ({userStories.length})
          </Text>
          <Stack gap="xs">
            {userStories.map((story) => (
              <Card key={story.id} withBorder p="sm" radius="sm">
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    {story.title}
                  </Text>
                  <Group gap="xs">
                    <Badge
                      size="xs"
                      color={getStatusColor(story.status as any)}
                    >
                      {story.status}
                    </Badge>
                    <Badge size="xs" variant="light">
                      {story.complexity} pts
                    </Badge>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>
      )}

      <Divider />

      {/* Actions */}
      <Group justify="flex-end">
        <Button variant="light">Edit Epic</Button>
        <Button>Start Refinement</Button>
      </Group>
    </Stack>
  );
}
