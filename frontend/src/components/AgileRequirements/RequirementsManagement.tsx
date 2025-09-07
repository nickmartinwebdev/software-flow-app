import { useState } from "react";
import {
  Container,
  Title,
  Tabs,
  Group,
  Button,
  ActionIcon,
  Text,
  Card,
  Stack,
  Select,
  TextInput,
  Modal,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconSettings,
  IconChartBar,
  IconList,
  IconHierarchy,
  IconTarget,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Epic, UserStory, ViewMode, Project } from "../../types/agile";
import { EpicsList } from "./EpicsList";
import { StoriesList } from "./StoriesList";
import { BacklogView } from "./BacklogView";
import { DependenciesView } from "./DependenciesView";
import { CreateEpicModal } from "./CreateEpicModal";
import { CreateStoryModal } from "./CreateStoryModal";
import { ProjectSettings } from "./ProjectSettings";
import { RequirementsMetrics } from "./RequirementsMetrics";

interface RequirementsManagementProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function RequirementsManagement({
  project,
  onUpdateProject,
}: RequirementsManagementProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("epics");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEpic, setSelectedEpic] = useState<string | null>(null);

  const [createEpicOpened, { open: openCreateEpic, close: closeCreateEpic }] =
    useDisclosure(false);
  const [
    createStoryOpened,
    { open: openCreateStory, close: closeCreateStory },
  ] = useDisclosure(false);
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const [metricsOpened, { open: openMetrics, close: closeMetrics }] =
    useDisclosure(false);

  const handleCreateEpic = (
    epic: Omit<Epic, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newEpic: Epic = {
      ...epic,
      id: `epic-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProject = {
      ...project,
      epics: [...project.epics, newEpic],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    closeCreateEpic();
  };

  const handleCreateStory = (
    story: Omit<UserStory, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newStory: UserStory = {
      ...story,
      id: `story-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revisionHistory: [],
    };

    const updatedProject = {
      ...project,
      userStories: [...project.userStories, newStory],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    closeCreateStory();
  };

  const getTabIcon = (mode: ViewMode) => {
    switch (mode) {
      case "epics":
        return <IconTarget size={16} />;
      case "stories":
        return <IconList size={16} />;
      case "backlog":
        return <IconChartBar size={16} />;
      case "dependencies":
        return <IconHierarchy size={16} />;
    }
  };

  const renderActiveView = () => {
    switch (viewMode) {
      case "epics":
        return (
          <EpicsList
            epics={project.epics}
            userStories={project.userStories}
            searchQuery={searchQuery}
            onUpdateEpic={(epic) => {
              const updatedProject = {
                ...project,
                epics: project.epics.map((e) => (e.id === epic.id ? epic : e)),
                updatedAt: new Date().toISOString(),
              };
              onUpdateProject(updatedProject);
            }}
          />
        );
      case "stories":
        return (
          <StoriesList
            userStories={project.userStories}
            epics={project.epics}
            searchQuery={searchQuery}
            selectedEpic={selectedEpic}
            onUpdateStory={(story) => {
              const updatedProject = {
                ...project,
                userStories: project.userStories.map((s) =>
                  s.id === story.id ? story : s,
                ),
                updatedAt: new Date().toISOString(),
              };
              onUpdateProject(updatedProject);
            }}
          />
        );
      case "backlog":
        return (
          <BacklogView project={project} onUpdateProject={onUpdateProject} />
        );
      case "dependencies":
        return (
          <DependenciesView
            epics={project.epics}
            userStories={project.userStories}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>{project.name}</Title>
            <Text size="sm" c="dimmed">
              {project.description}
            </Text>
          </div>
          <Group>
            <ActionIcon variant="light" onClick={openMetrics}>
              <IconChartBar size={18} />
            </ActionIcon>
            <ActionIcon variant="light" onClick={openSettings}>
              <IconSettings size={18} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Controls */}
        <Card withBorder>
          <Group justify="space-between">
            <Group>
              <TextInput
                placeholder="Search epics and stories..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ minWidth: 300 }}
              />
              {viewMode === "stories" && (
                <Select
                  placeholder="Filter by Epic"
                  data={[
                    { value: "", label: "All Epics" },
                    ...project.epics.map((epic) => ({
                      value: epic.id,
                      label: epic.title,
                    })),
                  ]}
                  value={selectedEpic}
                  onChange={setSelectedEpic}
                  clearable
                />
              )}
              <ActionIcon variant="light">
                <IconFilter size={16} />
              </ActionIcon>
            </Group>

            <Group>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openCreateEpic}
                variant="light"
              >
                New Epic
              </Button>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openCreateStory}
              >
                New Story
              </Button>
            </Group>
          </Group>
        </Card>

        {/* Navigation Tabs */}
        <Tabs
          value={viewMode}
          onChange={(value) => setViewMode(value as ViewMode)}
        >
          <Tabs.List>
            <Tabs.Tab value="epics" leftSection={getTabIcon("epics")}>
              Epics ({project.epics.length})
            </Tabs.Tab>
            <Tabs.Tab value="stories" leftSection={getTabIcon("stories")}>
              Stories ({project.userStories.length})
            </Tabs.Tab>
            <Tabs.Tab value="backlog" leftSection={getTabIcon("backlog")}>
              Backlog
            </Tabs.Tab>
            <Tabs.Tab
              value="dependencies"
              leftSection={getTabIcon("dependencies")}
            >
              Dependencies
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* Main Content */}
        {renderActiveView()}

        {/* Modals */}
        <CreateEpicModal
          opened={createEpicOpened}
          onClose={closeCreateEpic}
          onSubmit={handleCreateEpic}
          existingEpics={project.epics}
        />

        <CreateStoryModal
          opened={createStoryOpened}
          onClose={closeCreateStory}
          onSubmit={handleCreateStory}
          epics={project.epics}
          existingStories={project.userStories}
        />

        <Modal
          opened={settingsOpened}
          onClose={closeSettings}
          title="Project Settings"
          size="lg"
        >
          <ProjectSettings
            project={project}
            onUpdateProject={onUpdateProject}
            onClose={closeSettings}
          />
        </Modal>

        <Modal
          opened={metricsOpened}
          onClose={closeMetrics}
          title="Requirements Metrics"
          size="xl"
        >
          <RequirementsMetrics project={project} />
        </Modal>
      </Stack>
    </Container>
  );
}
