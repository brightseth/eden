// Task dependency system
export const taskDependencies: Record<string, string[]> = {
  'verify-wallet': ['connect-wallet'],
  'set-token-contract': ['connect-wallet', 'verify-wallet'],
  'set-ens': ['connect-wallet'],
  'enable-nft-sales': ['connect-wallet', 'set-pricing'],
  'set-pricing': ['set-token-contract'],
  'launch-agent': ['username', 'display-name', 'avatar', 'bio', 'connect-wallet', 'discord', 'test-creation'],
  
  // Stage 2 dependencies
  'lora': ['avatar', 'instructions'],
  'test-creation': ['image-gen'],
  'collections': ['test-creation'],
  
  // Stage 3 dependencies
  'shopify': ['usage-costs', 'connect-wallet'],
  'printify': ['shopify'],
  'public-launch': ['test-creation', 'discord', 'usage-costs']
};

// Critical tasks that must be complete before launch
export const criticalTasks = [
  'username',
  'display-name', 
  'avatar',
  'bio',
  'connect-wallet',
  'verify-wallet',
  'discord',
  'test-creation',
  'usage-costs'
];

// Check if task dependencies are met
export function canCompleteTask(taskId: string, completedTasks: string[]): {
  canComplete: boolean;
  missingDependencies: string[];
} {
  const dependencies = taskDependencies[taskId] || [];
  const missingDependencies = dependencies.filter(dep => !completedTasks.includes(dep));
  
  return {
    canComplete: missingDependencies.length === 0,
    missingDependencies
  };
}

// Check if ready to launch
export function checkLaunchReadiness(completedTasks: string[]): {
  isReady: boolean;
  missingCritical: string[];
  percentReady: number;
} {
  const missingCritical = criticalTasks.filter(task => !completedTasks.includes(task));
  const percentReady = Math.round(((criticalTasks.length - missingCritical.length) / criticalTasks.length) * 100);
  
  return {
    isReady: missingCritical.length === 0,
    missingCritical,
    percentReady
  };
}