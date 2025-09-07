import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  TextInput,
  Stack,
  Alert,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type FormValues = z.infer<typeof schema>;

export function Home() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      name: "",
      email: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Form values:", values);
    setSubmitted(true);
    notifications.show({
      title: "Success!",
      message: `Welcome, ${values.name}!`,
      color: "green",
    });
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="md">
            Software Flow App
          </Title>
          <Text size="lg" c="dimmed">
            React 19 + Mantine + TypeScript + Zod + React Query
          </Text>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Enter your name"
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Email"
              placeholder="Enter your email"
              {...form.getInputProps("email")}
            />

            <Button type="submit" fullWidth>
              Submit
            </Button>
          </Stack>
        </form>

        {submitted && (
          <Alert title="Form Submitted!" color="green">
            Your information has been processed successfully!
          </Alert>
        )}

        <Button component={Link} to="/about" variant="outline">
          Go to About Page
        </Button>

        <Button component={Link} to="/agile" variant="filled">
          Agile Requirements System
        </Button>
      </Stack>
    </Container>
  );
}
