import { Container, Title, Text, Button, Stack, Card, Loader, Alert } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUsers = async (): Promise<User[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];
};

export function About() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="md">About</Title>
          <Text size="lg" c="dimmed">
            This page demonstrates React Query data fetching
          </Text>
        </div>

        {isLoading && (
          <Card padding="lg">
            <Stack align="center" gap="md">
              <Loader size="md" />
              <Text>Loading users...</Text>
            </Stack>
          </Card>
        )}

        {error && (
          <Alert title="Error" color="red">
            Failed to fetch users. Please try again later.
          </Alert>
        )}

        {users && (
          <div>
            <Title order={3} mb="md">Users</Title>
            <Stack gap="sm">
              {users.map(user => (
                <Card key={user.id} padding="md" withBorder>
                  <Text fw={500}>{user.name}</Text>
                  <Text size="sm" c="dimmed">{user.email}</Text>
                </Card>
              ))}
            </Stack>
          </div>
        )}

        <Button component={Link} to="/" variant="outline">
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
}
