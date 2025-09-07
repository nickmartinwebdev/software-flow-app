import { Stack, Text, Card, Grid, Progress, Group, Badge } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import {
  IconTrendingUp,
  IconUsers,
  IconTarget,
  IconClock,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Project } from "../../types/agile";

interface RequirementsMetricsProps {
  project: Project;
}

export function RequirementsMetrics({ project }: RequirementsMetricsProps) {
  // Calculate metrics
  const totalEpics = project.epics.length;
  const totalStories = project.userStories.length;

  const completedEpics = project.epics.filter(
    (epic) => epic.status === "done",
  ).length;
  const completedStories = project.userStories.filter(
    (story) => story.status === "done",
  ).length;

  const epicsProgress =
    totalEpics > 0 ? Math.round((completedEpics / totalEpics) * 100) : 0;
  const storiesProgress =
    totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0;

  // Story points metrics
  const totalStoryPoints = project.userStories.reduce(
    (sum, story) => sum + story.complexity,
    0,
  );
  const completedStoryPoints = project.userStories
    .filter((story) => story.status === "done")
    .reduce((sum, story) => sum + story.complexity, 0);

  // Business value metrics
  const avgBusinessValue =
    totalStories > 0
      ? Math.round(
          (project.userStories.reduce(
            (sum, story) => sum + story.businessValue,
            0,
          ) /
            totalStories) *
            10,
        ) / 10
      : 0;

  // Status distribution data for charts
  const statusData = [
    {
      name: "Draft",
      value: project.userStories.filter((s) => s.status === "draft").length,
      color: "gray",
    },
    {
      name: "Refined",
      value: project.userStories.filter((s) => s.status === "refined").length,
      color: "blue",
    },
    {
      name: "Approved",
      value: project.userStories.filter((s) => s.status === "approved").length,
      color: "green",
    },
    {
      name: "In Development",
      value: project.userStories.filter((s) => s.status === "in-development")
        .length,
      color: "orange",
    },
    {
      name: "Done",
      value: project.userStories.filter((s) => s.status === "done").length,
      color: "teal",
    },
  ].filter((item) => item.value > 0);

  const priorityData = [
    {
      name: "Urgent",
      value: project.userStories.filter((s) => s.priority === "urgent").length,
      color: "red",
    },
    {
      name: "High",
      value: project.userStories.filter((s) => s.priority === "high").length,
      color: "orange",
    },
    {
      name: "Normal",
      value: project.userStories.filter((s) => s.priority === "normal").length,
      color: "blue",
    },
    {
      name: "Low",
      value: project.userStories.filter((s) => s.priority === "low").length,
      color: "gray",
    },
  ].filter((item) => item.value > 0);

  // Risk assessment
  const highRiskItems = [...project.epics, ...project.userStories].filter(
    (item) => item.riskLevel === "high",
  ).length;
  const mediumRiskItems = [...project.epics, ...project.userStories].filter(
    (item) => item.riskLevel === "medium",
  ).length;

  // Acceptance criteria metrics
  const totalAcceptanceCriteria = project.userStories.reduce(
    (sum, story) => sum + story.acceptanceCriteria.length,
    0,
  );
  const avgAcceptanceCriteria =
    totalStories > 0
      ? Math.round((totalAcceptanceCriteria / totalStories) * 10) / 10
      : 0;

  // Dependencies
  const totalDependencies =
    project.userStories.reduce(
      (sum, story) => sum + story.dependencies.length,
      0,
    ) + project.epics.reduce((sum, epic) => sum + epic.dependencies.length, 0);

  return (
    <Stack gap="md">
      {/* Overview Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Group justify="center" mb="xs">
              <IconTarget size={24} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xs" c="dimmed" mb="xs">
              Total Epics
            </Text>
            <Text size="xl" fw={700}>
              {totalEpics}
            </Text>
            <Progress value={epicsProgress} size="sm" mt="sm" />
            <Text size="xs" c="dimmed" mt="xs">
              {completedEpics} completed
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Group justify="center" mb="xs">
              <IconUsers size={24} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xs" c="dimmed" mb="xs">
              User Stories
            </Text>
            <Text size="xl" fw={700}>
              {totalStories}
            </Text>
            <Progress value={storiesProgress} size="sm" mt="sm" color="green" />
            <Text size="xs" c="dimmed" mt="xs">
              {completedStories} completed
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Group justify="center" mb="xs">
              <IconClock size={24} color="var(--mantine-color-orange-6)" />
            </Group>
            <Text size="xs" c="dimmed" mb="xs">
              Story Points
            </Text>
            <Text size="xl" fw={700}>
              {totalStoryPoints}
            </Text>
            <Progress
              value={
                totalStoryPoints > 0
                  ? (completedStoryPoints / totalStoryPoints) * 100
                  : 0
              }
              size="sm"
              mt="sm"
              color="orange"
            />
            <Text size="xs" c="dimmed" mt="xs">
              {completedStoryPoints} completed
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Group justify="center" mb="xs">
              <IconTrendingUp size={24} color="var(--mantine-color-violet-6)" />
            </Group>
            <Text size="xs" c="dimmed" mb="xs">
              Avg Business Value
            </Text>
            <Text size="xl" fw={700}>
              {avgBusinessValue}/10
            </Text>
            <Progress
              value={avgBusinessValue * 10}
              size="sm"
              mt="sm"
              color="violet"
            />
            <Text size="xs" c="dimmed" mt="xs">
              Across all stories
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Charts Row */}
      <Grid>
        <Grid.Col span={6}>
          <Card withBorder p="md">
            <Text size="sm" fw={600} mb="md">
              Status Distribution
            </Text>
            {statusData.length > 0 ? (
              <DonutChart
                data={statusData}
                chartLabel="Stories"
                size={200}
                thickness={40}
              />
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                No data available
              </Text>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card withBorder p="md">
            <Text size="sm" fw={600} mb="md">
              Priority Distribution
            </Text>
            {priorityData.length > 0 ? (
              <DonutChart
                data={priorityData}
                chartLabel="Stories"
                size={200}
                thickness={40}
              />
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                No data available
              </Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      {/* Quality Metrics */}
      <Grid>
        <Grid.Col span={4}>
          <Card withBorder p="md">
            <Group mb="md">
              <IconCheck size={20} color="var(--mantine-color-green-6)" />
              <Text size="sm" fw={600}>
                Quality Metrics
              </Text>
            </Group>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">Avg Acceptance Criteria</Text>
                <Badge variant="light" color="green">
                  {avgAcceptanceCriteria}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Total Acceptance Criteria</Text>
                <Badge variant="light" color="blue">
                  {totalAcceptanceCriteria}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Stories with Criteria</Text>
                <Badge variant="light" color="teal">
                  {
                    project.userStories.filter(
                      (s) => s.acceptanceCriteria.length > 0,
                    ).length
                  }
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card withBorder p="md">
            <Group mb="md">
              <IconAlertTriangle size={20} color="var(--mantine-color-red-6)" />
              <Text size="sm" fw={600}>
                Risk Assessment
              </Text>
            </Group>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">High Risk Items</Text>
                <Badge variant="light" color="red">
                  {highRiskItems}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Medium Risk Items</Text>
                <Badge variant="light" color="yellow">
                  {mediumRiskItems}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Risk Coverage</Text>
                <Badge variant="light" color="orange">
                  {Math.round(
                    ((highRiskItems + mediumRiskItems) /
                      (totalEpics + totalStories)) *
                      100,
                  )}
                  %
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card withBorder p="md">
            <Group mb="md">
              <IconTarget size={20} color="var(--mantine-color-blue-6)" />
              <Text size="sm" fw={600}>
                Complexity & Dependencies
              </Text>
            </Group>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">Total Dependencies</Text>
                <Badge variant="light" color="grape">
                  {totalDependencies}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Epic Dependencies</Text>
                <Badge variant="light" color="violet">
                  {project.epics.reduce(
                    (sum, epic) => sum + epic.dependencies.length,
                    0,
                  )}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Story Dependencies</Text>
                <Badge variant="light" color="indigo">
                  {project.userStories.reduce(
                    (sum, story) => sum + story.dependencies.length,
                    0,
                  )}
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Team & Context */}
      <Grid>
        <Grid.Col span={6}>
          <Card withBorder p="md">
            <Text size="sm" fw={600} mb="md">
              Project Context
            </Text>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">Domain</Text>
                <Badge variant="light">{project.context.domain}</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Industry</Text>
                <Badge variant="light">{project.context.industry}</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Technical Constraints</Text>
                <Badge variant="light">
                  {project.context.technicalConstraints.length}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Regulations</Text>
                <Badge variant="light">
                  {project.context.regulations.length}
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card withBorder p="md">
            <Text size="sm" fw={600} mb="md">
              Team Overview
            </Text>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">Team Members</Text>
                <Badge variant="light" color="cyan">
                  {project.team.length}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Stakeholders (Unique)</Text>
                <Badge variant="light" color="pink">
                  {
                    new Set(project.epics.flatMap((epic) => epic.stakeholders))
                      .size
                  }
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Project Age</Text>
                <Badge variant="light" color="gray">
                  {Math.ceil(
                    (new Date().getTime() -
                      new Date(project.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Last Updated</Text>
                <Badge variant="light" color="gray">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Progress Summary */}
      <Card withBorder p="md">
        <Text size="lg" fw={600} mb="md">
          Overall Progress Summary
        </Text>
        <Grid>
          <Grid.Col span={4}>
            <Text size="sm" c="dimmed" mb="xs">
              Epic Completion
            </Text>
            <Progress value={epicsProgress} size="lg" />
            <Text size="xs" ta="right" mt="xs">
              {epicsProgress}%
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" c="dimmed" mb="xs">
              Story Completion
            </Text>
            <Progress value={storiesProgress} size="lg" color="green" />
            <Text size="xs" ta="right" mt="xs">
              {storiesProgress}%
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" c="dimmed" mb="xs">
              Story Points Velocity
            </Text>
            <Progress
              value={
                totalStoryPoints > 0
                  ? (completedStoryPoints / totalStoryPoints) * 100
                  : 0
              }
              size="lg"
              color="orange"
            />
            <Text size="xs" ta="right" mt="xs">
              {totalStoryPoints > 0
                ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
                : 0}
              %
            </Text>
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );
}
