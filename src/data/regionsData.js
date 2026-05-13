// src/data/regionsData.js

export const regionsData = [
  {
    regionId: 'RU-VGG',
    regionName: 'Воронежская область',
    plants: [
      {
        name: 'ВТРЗ',
        fullName: 'Воронежский тепловозоремонтный завод',
        city: 'Воронеж',
        auditData: '/2026_01_14_ВТРЗ_Обычный_Итоговый_аудит.json'
      }
    ]
  },
  {
    regionId: 'RU-YAR',
    regionName: 'Ярославская область',
    plants: [
      {
        name: 'ЯЭРЗ',
        fullName: 'Ярославский электровозоремонтный завод',
        city: 'Ярославль',
        auditData: '/2026-01-14-ЯЭРЗ-Обычный-Итоговый аудит (1).json'
      }
    ]
  },
  {
    regionId: 'RU-ROS',
    regionName: 'Ростовская область',
    plants: [
      {
        name: 'РЭРЗ',
        fullName: 'Ростовский-на-Дону электровозоремонтный завод',
        city: 'Ростов-на-Дону',
        auditData: '/2026-01-20-РЭРЗ-Обычный-Итоговый аудит (2).json'
      }
    ]
  },
  {
    regionId: 'RU-ULY',
    regionName: ' Приморском край',
    plants: [
      {
        name: 'УЛРЗ',
        fullName: 'Уссурийский локомотиворемонтный завод',
        city: 'Уссурийск',
        auditData: '/2026-01-21-УЛРЗ-Обычный-Итоговый аудит (1).json'
      }
    ]
  },
  {
    regionId: 'RU-ALT',
    regionName: 'Астраханская область',
    plants: [
      {
        name: 'АТРЗ',
        fullName: 'Астраханский тепловозоремонтный завод',
        city: 'Астрахань',
        auditData: '/2026-01-27-АТРЗ-Обычный-Итоговый аудит (1).json'
      }
    ]
  },
  {
    regionId: 'RU-CHE',
    regionName: 'Челябинская область',
    plants: [
      {
        name: 'ЧЭРЗ',
        fullName: 'Челябинский электровозоремонтный завод',
        city: 'Челябинск',
        auditData: '/2026-01-27-ЧЭРЗ-Обычный-Итоговый аудит (2).json'
      }
    ]
  },
  {
    regionId: 'RU-ORE',
    regionName: 'Оренбургская область',
    plants: [
      {
        name: 'ОЛРЗ',
        fullName: 'Оренбургский локомотиворемонтный завод',
        city: 'Оренбург',
        auditData: '/2026-02-03-ОЛРЗ-Обычный-Итоговый аудит (1).json'
      }
    ]
  },
  {
    regionId: 'RU-UUD',
    regionName: 'Республика Бурятия',
    plants: [
      {
        name: 'УУЛВРЗ',
        fullName: 'Улан-Удэнский локомотивовагоноремонтный завод',
        city: 'Улан-Удэ',
        auditData: '/2026-02-04-УУЛВРЗ-Обычный-Итоговый аудит (1).json'
      }
    ]
  }
];

export const hasPlant = (regionId) => {
  const region = regionsData.find(r => r.regionId === regionId);
  return region && region.plants.length > 0;
};

export const getPlantByRegion = (regionId) => {
  const region = regionsData.find(r => r.regionId === regionId);
  return region && region.plants.length > 0 ? region.plants[0] : null;
};

export const getRegionsWithPlants = () => {
  return regionsData.filter(r => r.plants.length > 0);
};