const gradient = require('gradient-string');
const figlet = require('figlet');
const chalk = require('chalk');
const superagent = require('superagent');
const termImg = require('term-img');
const terminalLink = require('terminal-link');
const ZHIHUURL = 'https://news-at.zhihu.com/api/4/news/latest';
const DETAILURL = 'http://daily.zhihu.com/story/';

class ZHIHU {

    /**
     * get today info
     *
     * @static
     * @memberof ZHIHU
     */
    static async getTodayInfo () {
        try {
            let resp = await superagent.get(ZHIHUURL).send();
            let todayData = resp.body;
            let getImg = async (item) => {
                let image = await superagent.get(item.image).send();
                return [termImg.string(image.body, {width: '100px'}), item.title, item.id];
            }
            if (todayData && todayData.date && todayData.top_stories) {
                if (process.spinner) {
                    process.spinner.stop();
                }
                let promises = todayData.top_stories.map(item => getImg(item));
                console.log(chalk.green(`\n   Zhihu Daily(${chalk.bold(todayData.date)})\n`));
                for (let promise of promises) {
                    let result = await promise;
                    let title = result[1];
                    let link = terminalLink('>>', `${DETAILURL}${result[2]}`);
                    console.log(`  ${result[0]} ${chalk.green(title)} ${chalk.green(link)}\n\n`);
                }
            }
        } catch (error) {
            console.log(error);
            if (process.spinner) {
                process.spinner.stop();
            }
            console.log(chalk.green('\n' + chalk.bold('Failed to get info') + '\n'));
        }
    }
    
    /**
     * get version
     *
     * @static
     * @returns
     * @memberof ZHIHU
     */
    static version () {
        const banner = gradient.vice(figlet.textSync('ZHIHU', {
            font: 'standard'
        }));
        const gxchainVersion = chalk.cyanBright(`ZHIHU DAILY CLI Version: ${require('../package').version}`);
        const version = `${banner}\n${gxchainVersion}\n`;
        return version;
    }
}

module.exports = ZHIHU;
