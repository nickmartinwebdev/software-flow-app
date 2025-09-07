import { useState } from 'react';
import {
  Stack,
  Text,
  Card,
  Group,
  Badge,
  Button,
  Select,
  Switch,
  Grid,
  ActionIcon,
  Tooltip,
  Center,
} from '@mantine/core';
import {
  IconArrowRight,
  IconAlertTriangle,
  IconRefresh,
  IconFilter,
  IconHierarchy,
  IconLink,
} from '@tabler/icons-react';
import { Epic, UserStory } from '../../types/agile';

interface DependenciesViewProps {
  epics: Epic[];
  userStories: UserStory[];
}

export function DependenciesView({ epics, userStories }: DependenciesViewProps) {
  const [showOnlyBlocked, setShowOnlyBlocked] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Get all dependencies (epic-to-epic and story-to-story)
  const epicDependencies = epics.flatMap(epic =>
    epic.dependencies.map(depId => ({
      from: epic,
      to: epics.find(e => e.id === depId),
      type: 'epic' as const,
      id: `epic-${epic.id}-${depId}`
    }))
  ).filter(dep => dep.to);

  const storyDependencies = userStories.flatMap(story =>
    story.dependencies.map(depId => ({
      from: story,
      to: userStories.find(s => s.id === depId),
      type: 'story' as const,
      id: `story-${story.id}-${depId}`
    }))
  ).filter(dep => dep.to);

  const allDependencies = [...epicDependencies, ...storyDependencies];

  // Filter dependencies
  const filteredDependencies = allDependencies.filter(dep => {
    if (filterType !== 'all' && dep.type !== filterType) return false;
    if (showOnlyBlocked) {
      // Show only dependencies where the dependent item is blocked by incomplete dependency
      return dep.to!.status !== 'done';
    }
    return true;
  });

  // Find circular dependencies
  const findCircularDependencies = () => {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const circularPaths: string[][] = [];

    const hasCycle = (nodeId: string, path: string[]) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        circularPaths.push([...path.slice(cycleStart), nodeId]);
        return true;
      }

      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      // Check dependencies
      const deps = allDependencies.filter(dep => dep.from.id === nodeId);
      for (const dep of deps) {
        if (hasCycle(dep.to!.id, [...path, nodeId])) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    // Check all nodes
    [...epics, ...userStories].forEach(item => {
      if (!visited.has(item.id)) {
        hasCycle(item.id, []);
      }
    });

    return circularPaths;
  };

  const circularDependencies = findCircularDependencies();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'gray';
      case 'refined': return 'blue';
      case 'approved': return 'green';
      case 'in-development': return 'orange';
      case 'done': return 'green';
      default: return 'gray';
    }
  };

  const getItemTitle = (item: Epic | UserStory) => {
    return item.title;
  };

  const isBlocked = (dependency: typeof allDependencies[0]) => {
    return dependency.to!.status !== 'done';
  };

  if (allDependencies.length === 0) {
    return (
      <Card withBorder p="xl" ta="center">
        <IconHierarchy size={48} stroke={1} color="gray" />
        <Text size="lg" fw={500} mt="md">No dependencies found</Text>
        <Text size="sm" c="dimmed">
          Dependencies will appear here when you link epics and stories together
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Text size="xl" fw={600}>Dependencies Overview</Text>
          <Text size="sm" c="dimmed">
            Visualize and manage dependencies between epics and user stories
          </Text>
        </div>
        <Group>
          <ActionIcon variant="light" size="lg">
            <IconRefresh size={18} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <Group>
            <Select
              placeholder="Filter by type"
              data={[
                { value: 'all', label: 'All Dependencies' },
                { value: 'epic', label: 'Epic Dependencies' },
                { value: 'story', label: 'Story Dependencies' },
              ]}
              value={filterType}
              onChange={(value) => setFilterType(value || 'all')}
              leftSection={<IconFilter size={16} />}
            />
            <Switch
              label="Show only blocked items"
              checked={showOnlyBlocked}
              onChange={(e) => setShowOnlyBlocked(e.currentTarget.checked)}
            />
          </Group>
        </Group>
      </Card>

      {/* Statistics */}
      <Grid>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">Total Dependencies</Text>
            <Text size="xl" fw={600}>{allDependencies.length}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">Epic Dependencies</Text>
            <Text size="xl" fw={600}>{epicDependencies.length}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">Story Dependencies</Text>
            <Text size="xl" fw={600}>{storyDependencies.length}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card withBorder p="md" ta="center">
            <Text size="xs" c="dimmed" mb="xs">Circular Dependencies</Text>
            <Text size="xl" fw={600} c={circularDependencies.length > 0 ? 'red' : 'green'}>
              {circularDependencies.length}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Circular Dependencies Warning */}
      {circularDependencies.length > 0 && (
        <Card withBorder p="md" style={{ borderColor: 'var(--mantine-color-red-5)' }}>
          <Group mb="sm">
            <IconAlertTriangle size={20} color="red" />
            <Text size="sm" fw={600} c="red">
              Circular Dependencies Detected
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            The following circular dependencies need to be resolved:
          </Text>
          <Stack gap="xs">
            {circularDependencies.map((cycle, index) => (
              <Card key={index} withBorder p="sm" radius="sm">
                <Text size="sm" ff="monospace">
                  {cycle.join(' → ')}
                </Text>
              </Card>
            ))}
          </Stack>
        </Card>
      )}

      {/* Dependencies List */}
      <Stack gap="md">
        <Text size="lg" fw={600}>
          Dependencies ({filteredDependencies.length})
        </Text>

        {filteredDependencies.length === 0 ? (
          <Card withBorder p="md" ta="center">
            <Text size="sm" c="dimmed">
              No dependencies match the current filters
            </Text>
          </Card>
        ) : (
          <Stack gap="sm">
            {filteredDependencies.map((dependency) => (
              <Card key={dependency.id} withBorder p="md">
                <Group justify="space-between" align="flex-start">
                  <Group align="flex-start" style={{ flex: 1 }}>
                    {/* From Item */}
                    <div style={{ flex: 1 }}>
                      <Group mb="xs">
                        <Badge
                          variant="filled"
                          color={dependency.type === 'epic' ? 'violet' : 'blue'}
                          size="xs"
                        >
                          {dependency.type.toUpperCase()}
                        </Badge>
                        <Badge
                          color={getStatusColor(dependency.from.status)}
                          size="xs"
                        >
                          {dependency.from.status}
                        </Badge>
                      </Group>
                      <Text size="sm" fw={500} lineClamp={2}>
                        {getItemTitle(dependency.from)}
                      </Text>
                    </div>

                    {/* Arrow */}
                    <Center px="md">
                      <Group gap="xs">
                        <IconLink size={14} color="gray" />
                        <IconArrowRight
                          size={16}
                          color={isBlocked(dependency) ? 'red' : 'green'}
                        />
                      </Group>
                    </Center>

                    {/* To Item */}
                    <div style={{ flex: 1 }}>
                      <Group mb="xs">
                        <Badge
                          variant="filled"
                          color={dependency.type === 'epic' ? 'violet' : 'blue'}
                          size="xs"
                        >
                          {dependency.type.toUpperCase()}
                        </Badge>
                        <Badge
                          color={getStatusColor(dependency.to!.status)}
                          size="xs"
                        >
                          {dependency.to!.status}
                        </Badge>
                        {isBlocked(dependency) && (
                          <Tooltip label="This dependency is blocking progress">
                            <IconAlertTriangle size={14} color="red" />
                          </Tooltip>
                        )}
                      </Group>
                      <Text size="sm" fw={500} lineClamp={2}>
                        {getItemTitle(dependency.to!)}
                      </Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    {isBlocked(dependency) && (
                      <Badge color="red" variant="light" size="sm">
                        Blocked
                      </Badge>
                    )}
                    <Button size="xs" variant="subtle">
                      Edit
                    </Button>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
