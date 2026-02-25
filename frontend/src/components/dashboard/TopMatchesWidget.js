import React from "react";
import {
  Card,
  Text,
  Group,
  Progress,
  Button,
  Stack,
  Badge,
  Divider
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

function clampScore(score) {
  if (score === null || score === undefined) return 0;
  const n = Number(score);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function TopMatchesWidget({ matches = [] }) {
  const navigate = useNavigate();

  const goToDetails = (id) => {
    navigate(`/opportunities/${id}`); // ✅ matches your App.js route
  };

  // EMPTY STATE
  if (!matches || matches.length === 0) {
    return (
      <Card withBorder radius="lg" p="lg" shadow="sm">
        <Stack>
          <Text fw={700} size="lg">
            Rekomandimet e tua
          </Text>

          <Text size="sm" c="dimmed">
            Nuk kemi ende përputhje. Plotëso profilin që sistemi të sugjerojë
            mundësi më të mira për ty.
          </Text>

          <Group mt="sm">
            <Button
              variant="filled"
              onClick={() => navigate("/profile/volunteer")}
            >
              Plotëso Profilin
            </Button>

            <Button
              variant="light"
              onClick={() => navigate("/opportunities")}
            >
              Shfleto Mundësitë
            </Button>
          </Group>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder radius="lg" p="lg" shadow="sm">
      <Group justify="space-between" mb="sm">
        <div>
          <Text fw={700} size="lg">
            🔥 Top Përputhjet e tua
          </Text>
          <Text size="sm" c="dimmed">
            Bazuar në profilin dhe interesat e tua
          </Text>
        </div>

        <Button
          variant="subtle"
          size="xs"
          onClick={() => navigate("/matches")}
        >
          Shiko të gjitha
        </Button>
      </Group>

      <Divider my="sm" />

      <Stack>
        {matches.slice(0, 3).map((match) => {
          const score = clampScore(match.score);

          return (
            <Card
              key={match.id}
              withBorder
              radius="md"
              p="md"
              shadow="xs"
              style={{
                cursor: "pointer",
                transition: "transform 120ms ease"
              }}
              onClick={() => goToDetails(match.id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0px)")
              }
            >
              <Group justify="space-between" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Text fw={600}>{match.title}</Text>
                  <Text size="xs" c="dimmed">
                    {match.organization}
                  </Text>
                </div>

                <Badge color="green" variant="light">
                  {score}%
                </Badge>
              </Group>

              <Progress
                value={score}
                mt="sm"
                size="sm"
                radius="xl"
                color="green"
              />

              {Array.isArray(match.reasons) &&
                match.reasons.length > 0 && (
                  <Stack gap={2} mt="sm">
                    <Text size="xs" fw={600}>
                      Pse kjo përputhje?
                    </Text>

                    {match.reasons.slice(0, 3).map((reason, index) => (
                      <Text key={index} size="xs" c="dimmed">
                        • {reason}
                      </Text>
                    ))}
                  </Stack>
                )}

              <Group
                justify="flex-end"
                mt="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => goToDetails(match.id)}
                >
                  Shiko Detajet
                </Button>
              </Group>
            </Card>
          );
        })}
      </Stack>
    </Card>
  );
}