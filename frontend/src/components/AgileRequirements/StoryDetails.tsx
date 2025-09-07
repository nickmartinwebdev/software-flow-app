import {
  Stack,
  Text,
  Grid,
  Badge,
  Card,
  Group,
  Button,
  Divider,
  List,
} from "@mantine/core";
import { Epic, UserStory } from "../../types/agile";

interface StoryDetailsProps {
  story: UserStory;
  epics: Epic[];
  allStories: UserStory[];
  onUpdate: (story: UserStory) => void;
}

export function StoryDetails({ story, epics, allStories }: StoryDetailsProps) {
  const getStatusColor = (status: UserStory["status"]) => {
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

  const getPriorityColor = (priority: UserStory["priority"]) => {
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

  const getRiskColor = (risk: UserStory["riskLevel"]) => {
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

  const getEpicTitle = (epicId?: string) => {
    if (!epicId) return null;
    const epic = epics.find((e) => e.id === epicId);
    return epic?.title || "Unknown Epic";
  };

  return (
    <Stack gap="md">
      {/* Story Header */}
      <Group gap="md" mb="md">
        <Badge color={getStatusColor(story.status)} size="lg">
          {story.status}
        </Badge>
        <Badge color={getPriorityColor(story.priority)} size="lg">
          {story.priority}
        </Badge>
        <Badge color={getRiskColor(story.riskLevel)} size="lg">
          {story.riskLevel} risk
        </Badge>
        {story.epicId && (
          <Badge color="violet" size="lg">
            {getEpicTitle(story.epicId)}
          </Badge>
        )}
      </Group>

      {/* User Story Format */}
      <Card withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          User Story
        </Text>
        <Text size="sm" c="dimmed">
          <strong>As a</strong> {story.asA}, <strong>I want</strong>{" "}
          {story.iWant}, <strong>so that</strong> {story.soThat}
        </Text>
      </Card>

      {/* Description */}
      {story.description && (
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="sm">
            Description
          </Text>
          <Text size="sm" c="dimmed">
            {story.description}
          </Text>
        </Card>
      )}

      {/* Metrics */}
      <Grid>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Complexity
            </Text>
            <Text size="xl" fw={600}>
              {story.complexity} pts
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Business Value
            </Text>
            <Text size="xl" fw={600}>
              {story.businessValue}/10
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Acceptance Criteria
            </Text>
            <Text size="xl" fw={600}>
              {story.acceptanceCriteria.length}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Dependencies
            </Text>
            <Text size="xl" fw={600}>
              {story.dependencies.length}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Acceptance Criteria */}
      <Card withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Acceptance Criteria
        </Text>
        <Stack gap="sm">
          {story.acceptanceCriteria.map((criteria) => (
            <Card key={criteria.id} withBorder p="sm" radius="sm">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>
                  {criteria.description}
                </Text>
                <Badge
                  size="xs"
                  color={
                    criteria.priority === "must"
                      ? "red"
                      : criteria.priority === "should"
                        ? "orange"
                        : criteria.priority === "could"
                          ? "blue"
                          : "gray"
                  }
                >
                  {criteria.priority}
                </Badge>
              </Group>
              {criteria.gherkinScenario && (
                <div>
                  <Text size="xs" c="dimmed" mb="xs">
                    Gherkin Scenario:
                  </Text>
                  <Text
                    size="xs"
                    ff="monospace"
                    c="dimmed"
                    style={{
                      background: "var(--mantine-color-gray-0)",
                      padding: 8,
                      borderRadius: 4,
                    }}
                  >
                    {criteria.gherkinScenario}
                  </Text>
                </div>
              )}
            </Card>
          ))}
        </Stack>
      </Card>

      {/* Dependencies */}
      {story.dependencies.length > 0 && (
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="sm">
            Dependencies
          </Text>
          <Stack gap="xs">
            {story.dependencies.map((depId, index) => {
              const depStory = allStories.find((s) => s.id === depId);
              return (
                <Card key={index} withBorder p="xs" radius="sm">
                  <Group justify="space-between">
                    <Text size="sm">{depStory?.title || `Story ${depId}`}</Text>
                    <Badge
                      size="xs"
                      color={getStatusColor(depStory?.status || "draft")}
                    >
                      {depStory?.status || "unknown"}
                    </Badge>
                  </Group>
                </Card>
              );
            })}
          </Stack>
        </Card>
      )}

      {/* Tags */}
      {story.tags.length > 0 && (
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="sm">
            Tags
          </Text>
          <Group gap="xs">
            {story.tags.map((tag, index) => (
              <Badge key={index} variant="light" color="gray">
                {tag}
              </Badge>
            ))}
          </Group>
        </Card>
      )}

      {/* Revision History */}
      {story.revisionHistory.length > 0 && (
        <Card withBorder p="md">
          <Text size="sm" fw={600} mb="sm">
            Recent Changes
          </Text>
          <Stack gap="xs">
            {story.revisionHistory.slice(-3).map((revision) => (
              <Card key={revision.id} withBorder p="xs" radius="sm">
                <Group justify="space-between" mb="xs">
                  <Text size="xs" fw={500}>
                    Version {revision.version}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(revision.revisedAt).toLocaleDateString()}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed" mb="xs">
                  by {revision.revisedBy}
                </Text>
                <List size="xs" spacing={2}>
                  {revision.changes.map((change, index) => (
                    <List.Item key={index}>
                      <Text size="xs">{change}</Text>
                    </List.Item>
                  ))}
                </List>
                {revision.feedback && (
                  <Text
                    size="xs"
                    c="dimmed"
                    mt="xs"
                    style={{ fontStyle: "italic" }}
                  >
                    "{revision.feedback}"
                  </Text>
                )}
              </Card>
            ))}
          </Stack>
        </Card>
      )}

      <Divider />

      {/* Actions */}
      <Group justify="flex-end">
        <Button variant="light">Edit Story</Button>
        <Button>Start Refinement</Button>
      </Group>
    </Stack>
  );
}
