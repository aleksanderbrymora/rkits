import chalk from 'chalk';

export const logger = (message: string, payload?: string) => {
  const { log } = console;
  log(chalk.blue('==================='));
  log(chalk.yellow(message));
  payload && log(chalk.white(payload));
};
