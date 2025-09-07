import { useState } from "react";
import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  ActionIcon,
  Progress,
  Grid,
  Collapse,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  Modal,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconTrash,
  IconEye,
  IconTarget,
  IconAlertTriangle,
  IconDots,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Epic, UserStory } from "../../types/agile";
import { EpicDetails } from "./EpicDetails";

interface EpicsListProps {
  epics: Epic[];
  userStories: UserStory[];
  searchQuery: string;
  onUpdateEpic: (epic: Epic) => void;
}

export function EpicsList({
  epics,
  userStories,
  searchQuery,
  onUpdateEpic,
}: EpicsListProps) {
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);

  const filteredEpics = epics.filter(
    (epic) =>
      epic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      epic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      epic.businessGoal.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleExpanded = (epicId: string) => {
    const newExpanded = new Set(expandedEpics);
    if (newExpanded.has(epicId)) {
      newExpanded.delete(epicId);
    } else {
      newExpanded.add(epicId);
    }
    setExpandedEpics(newExpanded);
  };

  const getEpicStories = (epicId: string) => {
    return userStories.filter((story) => story.epicId === epicId);
  };

  const getEpicProgress = (epic: Epic) => {
    const stories = getEpicStories(epic.id);
    if (stories.length === 0) return 0;

    const completedStories = stories.filter(
      (story) => story.status === "done",
    ).length;
    return Math.round((completedStories / stories.length) * 100);
  };

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

  const handleViewDetails = (epic: Epic) => {
    setSelectedEpic(epic);
    openDetails();
  };

  if (filteredEpics.length === 0) {
    return (
      <Card withBorder p="xl" ta="center">
        <IconTarget size={48} stroke={1} color="gray" />
        <Text size="lg" fw={500} mt="md">
          No epics found
        </Text>
        <Text size="sm" c="dimmed">
          {searchQuery
            ? "Try adjusting your search criteria"
            : "Create your first epic to get started"}
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      {filteredEpics.map((epic) => {
        const stories = getEpicStories(epic.id);
        const progress = getEpicProgress(epic);
        const isExpanded = expandedEpics.has(epic.id);

        return (
          <Card key={epic.id} withBorder>
            <Stack gap="sm">
              {/* Epic Header */}
              <Group justify="space-between" wrap="nowrap">
                <Group>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => toggleExpanded(epic.id)}
                  >
                    {isExpanded ? (
                      <IconChevronDown size={16} />
                    ) : (
                      <IconChevronRight size={16} />
                    )}
                  </ActionIcon>

                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb={4}>
                      <Text fw={600} size="lg">
                        {epic.title}
                      </Text>
                      <Badge color={getStatusColor(epic.status)} size="sm">
                        {epic.status}
                      </Badge>
                      <Badge color={getPriorityColor(epic.priority)} size="sm">
                        {epic.priority}
                      </Badge>
                      {epic.riskLevel !== "low" && (
                        <Tooltip label={`${epic.riskLevel} risk`}>
                          <IconAlertTriangle
                            size={16}
                            color={getRiskColor(epic.riskLevel)}
                          />
                        </Tooltip>
                      )}
                    </Group>
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {epic.description}
                    </Text>
                  </div>
                </Group>

                <Group gap="xs">
                  <Menu position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleViewDetails(epic)}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit Epic
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                      >
                        Delete Epic
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>

              {/* Epic Metrics */}
              <Grid>
                <Grid.Col span={3}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Progress
                    </Text>
                    <Group gap="xs">
                      <Progress
                        value={progress}
                        size="sm"
                        style={{ flex: 1 }}
                      />
                      <Text size="sm" fw={500}>
                        {progress}%
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Stories
                    </Text>
                    <Text size="sm" fw={500}>
                      {stories.length}
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Business Value
                    </Text>
                    <Badge variant="light" color="blue" size="sm">
                      {epic.businessValue}/10
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Complexity
                    </Text>
                    <Badge variant="light" color="orange" size="sm">
                      {epic.complexity}
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={3}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Stakeholders
                    </Text>
                    <Group gap={4}>
                      {epic.stakeholders
                        .slice(0, 3)
                        .map((stakeholder, index) => (
                          <Avatar key={index} size="sm" name={stakeholder} />
                        ))}
                      {epic.stakeholders.length > 3 && (
                        <Badge variant="light" size="xs">
                          +{epic.stakeholders.length - 3}
                        </Badge>
                      )}
                    </Group>
                  </Stack>
                </Grid.Col>
              </Grid>

              {/* Expandable Content */}
              <Collapse in={isExpanded}>
                <Divider my="sm" />

                <Stack gap="md">
                  {/* Business Goal */}
                  <div>
                    <Text size="sm" fw={500} mb={4}>
                      Business Goal
                    </Text>
                    <Text size="sm" c="dimmed">
                      {epic.businessGoal}
                    </Text>
                  </div>

                  {/* Success Criteria */}
                  <div>
                    <Text size="sm" fw={500} mb={4}>
                      Success Criteria
                    </Text>
                    <Stack gap={4}>
                      {epic.successCriteria.map((criteria, index) => (
                        <Text key={index} size="sm" c="dimmed">
                          • {criteria}
                        </Text>
                      ))}
                    </Stack>
                  </div>

                  {/* Related Stories */}
                  {stories.length > 0 && (
                    <div>
                      <Text size="sm" fw={500} mb={8}>
                        Related Stories ({stories.length})
                      </Text>
                      <Grid>
                        {stories.slice(0, 6).map((story) => (
                          <Grid.Col key={story.id} span={6}>
                            <Card withBorder p="xs" radius="sm">
                              <Group justify="space-between">
                                <div style={{ flex: 1 }}>
                                  <Text size="sm" fw={500} lineClamp={1}>
                                    {story.title}
                                  </Text>
                                  <Group gap="xs" mt={4}>
                                    <Badge
                                      size="xs"
                                      color={getStatusColor(
                                        story.status as any,
                                      )}
                                    >
                                      {story.status}
                                    </Badge>
                                    <Badge size="xs" variant="light">
                                      {story.complexity} pts
                                    </Badge>
                                  </Group>
                                </div>
                              </Group>
                            </Card>
                          </Grid.Col>
                        ))}
                      </Grid>
                      {stories.length > 6 && (
                        <Button variant="subtle" size="sm" mt="xs">
                          View all {stories.length} stories
                        </Button>
                      )}
                    </div>
                  )}
                </Stack>
              </Collapse>
            </Stack>
          </Card>
        );
      })}

      {/* Epic Details Modal */}
      {selectedEpic && (
        <Modal
          opened={detailsOpened}
          onClose={closeDetails}
          title={selectedEpic.title}
          size="xl"
        >
          <EpicDetails
            epic={selectedEpic}
            userStories={getEpicStories(selectedEpic.id)}
            onUpdate={onUpdateEpic}
          />
        </Modal>
      )}
    </Stack>
  );
}
