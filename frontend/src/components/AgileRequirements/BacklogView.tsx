import { Stack, Text, Card, Group, Badge, Grid, Button } from "@mantine/core";
import { IconList, IconPlus } from "@tabler/icons-react";
import { Project } from "../../types/agile";

interface BacklogViewProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function BacklogView({ project }: BacklogViewProps) {
  // Prioritized backlog combining epics and stories
  const backlogItems = [
    ...project.epics.map((epic) => ({ ...epic, type: "epic" as const })),
    ...project.userStories
      .filter((story) => !story.epicId) // Standalone stories not part of an epic
      .map((story) => ({ ...story, type: "story" as const })),
  ].sort((a, b) => {
    // Sort by priority (urgent > high > normal > low)
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
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

  if (backlogItems.length === 0) {
    return (
      <Card withBorder p="xl" ta="center">
        <IconList size={48} stroke={1} color="gray" />
        <Text size="lg" fw={500} mt="md">
          Backlog is empty
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Create epics and user stories to build your product backlog
        </Text>
        <Group justify="center">
          <Button leftSection={<IconPlus size={16} />}>Create Epic</Button>
          <Button variant="light" leftSection={<IconPlus size={16} />}>
            Create Story
          </Button>
        </Group>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Text size="xl" fw={600}>
            Product Backlog
          </Text>
          <Text size="sm" c="dimmed">
            Prioritized list of features and user stories
          </Text>
        </div>
        <Group>
          <Button size="sm" variant="light">
            Sprint Planning
          </Button>
          <Button size="sm" variant="light">
            Bulk Edit
          </Button>
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={4}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Total Items
            </Text>
            <Text size="xl" fw={600}>
              {backlogItems.length}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Epics
            </Text>
            <Text size="xl" fw={600}>
              {project.epics.length}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">
              Stories
            </Text>
            <Text size="xl" fw={600}>
              {project.userStories.length}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Stack gap="sm">
        {backlogItems.map((item, index) => (
          <Card key={`${item.type}-${item.id}`} withBorder p="md">
            <Group justify="space-between" mb="sm">
              <Group>
                <Badge
                  variant="filled"
                  color={item.type === "epic" ? "violet" : "blue"}
                  size="sm"
                >
                  {item.type.toUpperCase()}
                </Badge>
                <Text fw={600}>{item.title}</Text>
                <Badge color={getStatusColor(item.status)} size="sm">
                  {item.status}
                </Badge>
                <Badge color={getPriorityColor(item.priority)} size="sm">
                  {item.priority}
                </Badge>
              </Group>
              <Group>
                <Text size="sm" c="dimmed">
                  #{index + 1}
                </Text>
              </Group>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed" lineClamp={2}>
                {item.type === "epic"
                  ? item.description
                  : `As a ${(item as any).asA}, I want ${(item as any).iWant}, so that ${(item as any).soThat}`}
              </Text>
              <Group gap="md">
                <div>
                  <Text size="xs" c="dimmed">
                    Business Value
                  </Text>
                  <Text size="sm" fw={500}>
                    {item.businessValue}/10
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Complexity
                  </Text>
                  <Text size="sm" fw={500}>
                    {item.complexity} pts
                  </Text>
                </div>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
