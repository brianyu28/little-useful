import {
  Checkbox,
  NumberInput,
  SegmentedControl,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import React from "react";
import ToolPage from "../../components/ToolPage";
import styles from "./BmiCalculator.module.scss";
import { BmiCalculatorConfig } from "./BmiCalculatorConfig";
import {
  BMI_CATEGORIES,
  calculateImperialBmi,
  calculateMetricBmi,
  getBmiCategory,
} from "./utils/bmi";

type MeasurementSystem = "metric" | "imperial";

const measurementSystems = [
  { label: "Imperial", value: "imperial" },
  { label: "Metric", value: "metric" },
];

function getNumber(value: number | string) {
  return typeof value === "number" ? value : 0;
}

export default function BmiCalculator() {
  const [system, setSystem] = React.useState<MeasurementSystem>("imperial");
  const [useAsianThresholds, setUseAsianThresholds] = React.useState(false);
  const [weightKg, setWeightKg] = React.useState<number | string>("");
  const [heightCm, setHeightCm] = React.useState<number | string>("");
  const [weightLb, setWeightLb] = React.useState<number | string>("");
  const [heightFt, setHeightFt] = React.useState<number | string>("");
  const [heightIn, setHeightIn] = React.useState<number | string>("");

  const bmi = React.useMemo(
    () =>
      system === "metric"
        ? calculateMetricBmi(getNumber(weightKg), getNumber(heightCm))
        : calculateImperialBmi(
            getNumber(weightLb),
            getNumber(heightFt),
            getNumber(heightIn),
          ),
    [heightCm, heightFt, heightIn, system, weightKg, weightLb],
  );
  const thresholdSet = useAsianThresholds ? "asian" : "standard";
  const category = bmi == null ? undefined : getBmiCategory(bmi, thresholdSet);

  return (
    <ToolPage
      description={BmiCalculatorConfig.description}
      size="sm"
      title={BmiCalculatorConfig.title}
    >
      <Stack gap="lg">
        <SegmentedControl
          aria-label="Measurement system"
          data={measurementSystems}
          fullWidth
          onChange={(value) => setSystem(value as MeasurementSystem)}
          value={system}
        />

        {system === "metric" ? (
          <div className={styles.inputGrid}>
            <NumberInput
              decimalScale={1}
              label="Weight (kg)"
              min={0}
              onChange={setWeightKg}
              value={weightKg}
            />
            <NumberInput
              decimalScale={1}
              label="Height (cm)"
              min={0}
              onChange={setHeightCm}
              value={heightCm}
            />
          </div>
        ) : (
          <div className={styles.inputGrid}>
            <NumberInput
              decimalScale={1}
              label="Weight (lb)"
              min={0}
              onChange={setWeightLb}
              value={weightLb}
            />
            <div className={styles.heightInputs}>
              <NumberInput
                allowDecimal={false}
                label="Height (ft)"
                min={0}
                onChange={setHeightFt}
                value={heightFt}
              />
              <NumberInput
                decimalScale={1}
                label="Height (in)"
                min={0}
                onChange={setHeightIn}
                value={heightIn}
              />
            </div>
          </div>
        )}

        <Checkbox
          checked={useAsianThresholds}
          label="Use Asian BMI thresholds"
          onChange={(event) =>
            setUseAsianThresholds(event.currentTarget.checked)
          }
        />

        <section aria-live="polite" className={styles.result}>
          <Text c="dimmed" fw={700} size="sm">
            Your BMI
          </Text>
          {bmi != null && category != null ? (
            <>
              <div className={styles.bmiValue}>{bmi.toFixed(1)}</div>
              <div className={styles.category}>{category.label}</div>
            </>
          ) : (
            <Text c="dimmed" mt="xs" size="sm">
              Enter weight and height to calculate BMI
            </Text>
          )}
        </section>

        <section aria-label="BMI classification thresholds">
          <Text fw={700} mb="xs">
            {useAsianThresholds ? "Asian" : "Standard"} adult BMI thresholds
          </Text>
          <Table className={styles.table} withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Category</Table.Th>
                <Table.Th>BMI (kg/m²)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {BMI_CATEGORIES[thresholdSet].map((item) => (
                <Table.Tr
                  className={
                    item.label === category?.label
                      ? styles.activeRow
                      : undefined
                  }
                  key={item.label}
                >
                  <Table.Td>{item.label}</Table.Td>
                  <Table.Td>{item.rangeLabel}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Text c="dimmed" mt="sm" size="xs">
            Not medical advice. This tool is for educational purposes only.
          </Text>
        </section>
      </Stack>
    </ToolPage>
  );
}
