import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

// Схема для данных аудита
export const auditDataSchema = {
  type: "object",
  properties: {
    coefficients: { type: "object" },
    results: { type: "object" },
    esteem_results: { type: "object" }
  },
  required: ["coefficients", "results", "esteem_results"]
};

export const validateAuditData = ajv.compile(auditDataSchema);

// Схема для данных графика
export const chartDataSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      value1: { type: "number" },
      value2: { type: "number" }
    },
    required: ["name", "value1", "value2"]
  }
};

export const validateChartData = ajv.compile(chartDataSchema);