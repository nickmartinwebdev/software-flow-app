import { useState } from "react";
import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  ActionIcon,
  Grid,
  Divider,
  Menu,
  Modal,
  Tooltip,
  Collapse,
  List,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconTrash,
  IconEye,
  IconUser,
  IconTarget,
  IconClock,
  IconAlertTriangle,
  IconDots,
  IconLink,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Epic, UserStory } from "../../types/agile";
import { StoryDetails } from "./StoryDetails";

interface StoriesListProps {
  userStories: UserStory[];
  epics: Epic[];
  searchQuery: string;
  selectedEpic: string | null;
  onUpdateStory: (story: UserStory) => void;
}

export function StoriesList({
  userStories,
  epics,
  searchQuery,
  selectedEpic,
  onUpdateStory,
}: StoriesListProps) {
  const [expandedStories, setExpandedStories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);

  const filteredStories = userStories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.asA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.iWant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.soThat.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEpic = !selectedEpic || story.epicId === selectedEpic;

    return matchesSearch && matchesEpic;
  });

  const toggleExpanded = (storyId: string) => {
    const newExpanded = new Set(expandedStories);
    if (newExpanded.has(storyId)) {
      newExpanded.delete(storyId);
    } else {
      newExpanded.add(storyId);
    }
    setExpandedStories(newExpanded);
  };

  const getEpicTitle = (epicId?: string) => {
    if (!epicId) return null;
    const epic = epics.find((e) => e.id === epicId);
    return epic?.title || "Unknown Epic";
  };

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

  const handleViewDetails = (story: UserStory) => {
    setSelectedStory(story);
    openDetails();
  };

  if (filteredStories.length === 0) {
    return (
      <Card withBorder p="xl" ta="center">
        <IconUser size={48} stroke={1} color="gray" />
        <Text size="lg" fw={500} mt="md">
          No user stories found
        </Text>
        <Text size="sm" c="dimmed">
          {searchQuery || selectedEpic
            ? "Try adjusting your search or filter criteria"
            : "Create your first user story to get started"}
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      {filteredStories.map((story) => {
        const isExpanded = expandedStories.has(story.id);
        const epicTitle = getEpicTitle(story.epicId);

        return (
          <Card key={story.id} withBorder>
            <Stack gap="sm">
              {/* Story Header */}
              <Group justify="space-between" wrap="nowrap">
                <Group>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => toggleExpanded(story.id)}
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
                        {story.title}
                      </Text>
                      <Badge color={getStatusColor(story.status)} size="sm">
                        {story.status}
                      </Badge>
                      <Badge color={getPriorityColor(story.priority)} size="sm">
                        {story.priority}
                      </Badge>
                      {story.riskLevel !== "low" && (
                        <Tooltip label={`${story.riskLevel} risk`}>
                          <IconAlertTriangle
                            size={16}
                            color={getRiskColor(story.riskLevel)}
                          />
                        </Tooltip>
                      )}
                      {epicTitle && (
                        <Badge
                          variant="light"
                          color="violet"
                          size="sm"
                          leftSection={<IconTarget size={10} />}
                        >
                          {epicTitle}
                        </Badge>
                      )}
                    </Group>

                    {/* User Story Format */}
                    <Text size="sm" c="dimmed">
                      <strong>As a</strong> {story.asA}, <strong>I want</strong>{" "}
                      {story.iWant}, <strong>so that</strong> {story.soThat}
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
                        onClick={() => handleViewDetails(story)}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit Story
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                      >
                        Delete Story
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>

              {/* Story Metrics */}
              <Grid>
                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Complexity
                    </Text>
                    <Badge variant="light" color="orange" size="sm">
                      {story.complexity} pts
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Business Value
                    </Text>
                    <Badge variant="light" color="blue" size="sm">
                      {story.businessValue}/10
                    </Badge>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Acceptance Criteria
                    </Text>
                    <Text size="sm" fw={500}>
                      {story.acceptanceCriteria.length}
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Dependencies
                    </Text>
                    <Group gap="xs">
                      <Text size="sm" fw={500}>
                        {story.dependencies.length}
                      </Text>
                      {story.dependencies.length > 0 && (
                        <IconLink size={14} color="gray" />
                      )}
                    </Group>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Estimated Hours
                    </Text>
                    <Group gap="xs">
                      <IconClock size={14} color="gray" />
                      <Text size="sm" fw={500}>
                        {story.estimatedHours || "N/A"}
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={2}>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Tags
                    </Text>
                    <Group gap="xs">
                      {story.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} size="xs" variant="light" color="gray">
                          {tag}
                        </Badge>
                      ))}
                      {story.tags.length > 2 && (
                        <Badge size="xs" variant="light">
                          +{story.tags.length - 2}
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
                  {/* Description */}
                  {story.description && (
                    <div>
                      <Text size="sm" fw={500} mb={4}>
                        Description
                      </Text>
                      <Text size="sm" c="dimmed">
                        {story.description}
                      </Text>
                    </div>
                  )}

                  {/* Acceptance Criteria */}
                  <div>
                    <Text size="sm" fw={500} mb={8}>
                      Acceptance Criteria ({story.acceptanceCriteria.length})
                    </Text>
                    <Stack gap="xs">
                      {story.acceptanceCriteria.map((criteria) => (
                        <Card key={criteria.id} withBorder p="sm" radius="sm">
                          <Stack gap="xs">
                            <Group justify="space-between">
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
                                <Text size="xs" c="dimmed" mb={4}>
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
                          </Stack>
                        </Card>
                      ))}
                    </Stack>
                  </div>

                  {/* Dependencies */}
                  {story.dependencies.length > 0 && (
                    <div>
                      <Text size="sm" fw={500} mb={8}>
                        Dependencies
                      </Text>
                      <List size="sm" spacing="xs">
                        {story.dependencies.map((depId, index) => {
                          const depStory = userStories.find(
                            (s) => s.id === depId,
                          );
                          return (
                            <List.Item key={index}>
                              <Group gap="xs">
                                <IconLink size={12} />
                                <Text size="sm" c="dimmed">
                                  {depStory?.title || `Story ${depId}`}
                                </Text>
                                <Badge
                                  size="xs"
                                  color={getStatusColor(
                                    depStory?.status || "draft",
                                  )}
                                >
                                  {depStory?.status || "unknown"}
                                </Badge>
                              </Group>
                            </List.Item>
                          );
                        })}
                      </List>
                    </div>
                  )}

                  {/* Revision History */}
                  {story.revisionHistory.length > 0 && (
                    <div>
                      <Text size="sm" fw={500} mb={8}>
                        Recent Changes ({story.revisionHistory.length})
                      </Text>
                      <Stack gap="xs">
                        {story.revisionHistory.slice(-3).map((revision) => (
                          <Card key={revision.id} withBorder p="xs" radius="sm">
                            <Group justify="space-between" mb="xs">
                              <Text size="xs" fw={500}>
                                Version {revision.version}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {new Date(
                                  revision.revisedAt,
                                ).toLocaleDateString()}
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
                      {story.revisionHistory.length > 3 && (
                        <Button variant="subtle" size="xs" mt="xs">
                          View all {story.revisionHistory.length} revisions
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

      {/* Story Details Modal */}
      {selectedStory && (
        <Modal
          opened={detailsOpened}
          onClose={closeDetails}
          title={selectedStory.title}
          size="xl"
        >
          <StoryDetails
            story={selectedStory}
            epics={epics}
            allStories={userStories}
            onUpdate={onUpdateStory}
          />
        </Modal>
      )}
    </Stack>
  );
}
