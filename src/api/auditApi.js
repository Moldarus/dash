// src/api/auditApi.js
import Ajv from 'ajv';
import countByFormulaTotal from '../utils/countByFormulaTotal';

const ajv = new Ajv();

const auditDataSchema = {
  type: "object",
  properties: {
    coefficients: { type: "object" },
    results: { type: "object" },
    esteem_results: { type: "object" },
    self_audit: { type: "object" }
  },
  required: ["coefficients", "results", "esteem_results"]
};

const validateAuditData = ajv.compile(auditDataSchema);

// Подсчёт количества true в JSON по разделам
function countTrueValues(dataObj) {
  if (!dataObj) return { data_count: [] };

  const result = [];

  for (const [sectionName, sectionData] of Object.entries(dataObj)) {
    let sectionTrueCount = 0;
    const categories = [];

    for (const [catName, catData] of Object.entries(sectionData)) {
      let catTrueCount = 0;

      for (const [levelName, levelData] of Object.entries(catData)) {
        for (const [taskKey, taskValue] of Object.entries(levelData)) {
          if (taskValue === true) {
            catTrueCount++;
            sectionTrueCount++;
          }
        }
      }

      categories.push({
        name: catName,
        trueCount: catTrueCount
      });
    }

    result.push({
      name: sectionName,
      trueCount: sectionTrueCount,
      categories: categories
    });
  }

  return { data_count: result };
}

export const auditApi = {
  async loadAuditData(auditFilePath) {
    try {
      if (!auditFilePath) {
        throw new Error('Не указан путь к файлу аудита (auditFilePath)');
      }

      console.log('📥 auditApi: Загружаем файл:', auditFilePath);

      const response = await fetch(auditFilePath);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить ${auditFilePath} (статус: ${response.status})`);
      }

      const data = await response.json();

      const valid = validateAuditData(data);
      if (!valid) {
        console.error('Ошибка валидации:', validateAuditData.errors);
        throw new Error('Данные не прошли валидацию AJV');
      }

      console.log('auditApi: Данные загружены и валидированы');
      return data;
    } catch (error) {
      console.error('auditApi: Ошибка загрузки:', error);
      throw error;
    }
  },

  async getChartData(auditFilePath) {
    try {
      const auditData = await this.loadAuditData(auditFilePath);

      const selfAuditData = countByFormulaTotal(auditData.results, auditData.coefficients);
      const auditDataProcessed = countByFormulaTotal(auditData.esteem_results, auditData.coefficients);

      const chartData = selfAuditData.data_count.map((item, index) => {
        const auditItem = auditDataProcessed.data_count[index];

        return {
          name: item.name,
          value1: parseFloat(item.value) || 0,
          value2: auditItem ? parseFloat(auditItem.value) || 0 : 0
        };
      });

      const summaryValue = typeof selfAuditData.summary === 'number'
        ? selfAuditData.summary
        : parseFloat(selfAuditData.summary) || 0;

      const esteemSummaryValue = typeof auditDataProcessed.summary === 'number'
        ? auditDataProcessed.summary
        : parseFloat(auditDataProcessed.summary) || 0;

      return {
        chartData,
        summary: summaryValue,
        esteemSummary: esteemSummaryValue
      };
    } catch (error) {
      console.error('auditApi getChartData:', error);
      throw error;
    }
  },

  async getTableData(auditFilePath) {
    try {
      const auditData = await this.loadAuditData(auditFilePath);

      const selfAuditData = countByFormulaTotal(auditData.results, auditData.coefficients);
      const auditDataProcessed = countByFormulaTotal(auditData.esteem_results, auditData.coefficients);

      return selfAuditData.data_count.map((item, index) => {
        const auditItem = auditDataProcessed.data_count[index];

        return {
          sectionName: item.name,
          sectionValue1: parseFloat(item.value) || 0,
          sectionValue2: auditItem ? parseFloat(auditItem.value) || 0 : 0,
          coefficient: auditData.coefficients[item.name] || 0,
          categories: Object.entries(item.category_scors || {}).map(([catName, catScore]) => {
            const auditCatScore = auditItem?.category_scors?.[catName];

            let selfTrueCount = 0;
            let auditTrueCount = 0;
            let totalQuestions = 0;

            const selfCatData = auditData.results?.[item.name]?.[catName];
            const auditCatData = auditData.esteem_results?.[item.name]?.[catName];

            // Считаем общее количество вопросов и true в самооценке
            if (selfCatData) {
              for (const [levelName, levelData] of Object.entries(selfCatData)) {
                for (const [taskKey, taskValue] of Object.entries(levelData)) {
                  totalQuestions++;
                  if (taskValue === true) selfTrueCount++;
                }
              }
            }

            // Считаем true в аудите
            if (auditCatData) {
              for (const [levelName, levelData] of Object.entries(auditCatData)) {
                for (const [taskKey, taskValue] of Object.entries(levelData)) {
                  if (taskValue === true) auditTrueCount++;
                }
              }
            }

            return {
              name: catName,
              value: parseFloat(catScore) || 0,
              auditValue: auditCatScore ? parseFloat(auditCatScore) || 0 : 0,
              trueCount: selfTrueCount,
              auditCount: auditTrueCount,
              totalQuestions: totalQuestions
            };
          }),
          isOpen: false
        };
      });
    } catch (error) {
      console.error('auditApi getTableData:', error);
      throw error;
    }
  },

  async getClosedTasksData(auditFilePath) {
    try {
      const auditData = await this.loadAuditData(auditFilePath);
      
      const selfAuditTrue = countTrueValues(auditData.results);
      const auditTrue = countTrueValues(auditData.esteem_results);

      return selfAuditTrue.data_count.map((item, index) => {
        const auditItem = auditTrue.data_count[index];
        
        return {
          name: item.name,
          selfAuditCount: item.trueCount || 0,
          auditCount: auditItem ? auditItem.trueCount : 0
        };
      });
    } catch (error) {
      console.error('auditApi getClosedTasksData:', error);
      throw error;
    }
  }
};