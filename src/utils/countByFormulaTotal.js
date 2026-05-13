// src/utils/countByFormulaTotal.js

const right_answer = {
  "true": true,
  "false": false,
  "null": null
};

export default function countByFormulaTotal(data_results, data_coefficient) {
  const count_part_name = Object.keys(data_results).length;
  const array_part_name = Object.keys(data_results);
  let coefficient = data_coefficient;
  const result_list = [];
  const write_answer = right_answer;

  for (var index_part_name in array_part_name) {
    let part_name = array_part_name[index_part_name];
    let array_category = Object.keys(data_results[part_name]);
    let sum_yes_in_categories = 0;
    let scors_in_categorie = {};

    for (var index_category in array_category) {
      let category = array_category[index_category];
      let array_level = Object.keys(data_results[part_name][category]);
      let flag_zero = false;
      let sum_yes_score_in_levels = 0;

      for (var index_level in array_level) {
        let level = array_level[index_level];
        let array_tasks = data_results[part_name][category][level];

        let count_no_or_null_in_level = Object.values(array_tasks).filter(val => write_answer[val] !== true).length;
        let count_yes_in_level = Object.values(array_tasks).filter(val => write_answer[val] === true).length;
        let count_tasks_in_level = Object.values(array_tasks).length;
        let score = count_tasks_in_level > 0 ? count_yes_in_level / count_tasks_in_level : 0;

        if (flag_zero == false) {
          sum_yes_score_in_levels = sum_yes_score_in_levels + score;
          if (count_no_or_null_in_level != 0) {
            flag_zero = true;
          }
        } else {
          sum_yes_score_in_levels = sum_yes_score_in_levels + 0;
        }
      }

      Object.assign(scors_in_categorie, { [category]: sum_yes_score_in_levels });
      sum_yes_in_categories = sum_yes_in_categories + sum_yes_score_in_levels;
    }

    result_list.push({
      name: `${part_name}`,
      value: `${((sum_yes_in_categories / array_category.length)).toFixed(2)}`,
      category_scors: scors_in_categorie
    });
  }

  const sum_scors = result_list.reduce((sum, current) => {
    return sum + (current.value * coefficient[current.name]);
  }, 0);

  const final_summary = sum_scors.toFixed(2);

  const final_variant = {
    "data_count": result_list,
    "summary": final_summary
  };

  return final_variant;
}