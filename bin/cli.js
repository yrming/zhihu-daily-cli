#!/usr/bin/env node

const program = require('commander');
const importLazy = require('import-lazy')(require);
const ora = importLazy('ora');
const ZHIHU = importLazy('../src/zhihu.js');

program
    .option('-v, --version', 'Output the version info')
    .version(ZHIHU.version());

program
    .command('today')
    .action(() => {
        process.spinner = ora('Fetching').start();
        ZHIHU.getTodayInfo();
    });

program
    .command("*")
    .action(function () {
        console.log('\nerror: command not found\n');
        process.exit(1);
    });
program.parse(process.argv);

if (program.args.length === 0) {
    console.log(ZHIHU.version());
}