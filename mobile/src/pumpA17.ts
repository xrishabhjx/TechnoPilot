export const EQUIPMENT = {
  id: 'PUMP-A17',
  name: 'Pump A17',
  type: 'Industrial Centrifugal Pump',
  mode: 'Maintenance Mode',
  lastService: '11 months ago',
};

export const DOCS: Record<string, any> = {
  manual: {
    id: 'manual',
    title: 'Pump A17 Maintenance Manual',
    type: 'Manual',
    excerpt:
      'Bearing inspection procedure and lubrication guidance for centrifugal pump assemblies.',
    date: null,
  },
  specs: {
    id: 'specs',
    title: 'Pump A17 Operating Specifications',
    type: 'Specification',
    excerpt:
      'Normal bearing temperature range: 40–80°C. Vibration threshold: below 4.5 mm/s.',
    date: null,
  },
  svc17: {
    id: 'svc17',
    title: 'Service Report #17',
    type: 'Service Report',
    excerpt:
      'Excessive vibration traced to bearing degradation. Bearing replaced.',
    date: '2025-08-14',
  },
  svc21: {
    id: 'svc21',
    title: 'Service Report #21',
    type: 'Service Report',
    excerpt:
      'Temperature fluctuation traced to insufficient lubrication. Lubrication restored.',
    date: '2025-11-02',
  },
  history: {
    id: 'history',
    title: 'Pump A17 Maintenance History',
    type: 'Machine History',
    excerpt: 'Bearing replaced 11 months ago following excessive vibration.',
    date: '2025-08-14',
  },
  troubleshoot: {
    id: 'troubleshoot',
    title: 'Pump A17 Troubleshooting Guide',
    type: 'Troubleshooting Guide',
    excerpt:
      'Diagnostic checklist for vibration, temperature, and pressure faults — includes power-down and isolation steps.',
    date: null,
  },
};

export const HISTORY_EVENTS = [
  {
    date: '2025-08-14',
    issue: 'Excessive vibration',
    diagnosis: 'Bearing degradation',
    resolution: 'Bearing replaced',
    component: 'Drive-end bearing',
    key: 'bearing',
  },
  {
    date: '2025-11-02',
    issue: 'Temperature fluctuation',
    diagnosis: 'Insufficient lubrication',
    resolution: 'Lubrication restored',
    component: 'Bearing housing',
    key: 'lubrication',
  },
];
