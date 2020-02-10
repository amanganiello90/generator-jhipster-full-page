const chalk = require('chalk');
const _ = require('lodash');
// eslint-disable-next-line
const jhiCore = require('jhipster-core');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const jhipsterEntityPrompt = require('generator-jhipster/generators/entity/prompts');
const packagejs = require('../../package.json');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'tablePage' || args === 'formPage') {
                    // do something when argument
                    this.pageName = args;
                    this.pageType = args;
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getAllJhipsterConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Cannot read .yo-rc.json');
                }
                // set every property from config
                Object.keys(this.jhipsterAppConfig).forEach(prop => {
                    this[prop] = this.jhipsterAppConfig[prop];
                });
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(
                    `\nWelcome to the ${chalk.bold.yellow('JHipster full-page')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`
                );
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(
                        `\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`
                    );
                }
            }
        };
    }

    get prompting() {
        return {
            customPrompt() {
                const prompts = [
                    {
                        type: 'input',
                        name: 'pageName',
                        message: 'What is the name of your page?',
                        default: 'examplePage',
                        validate: input => {
                            if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
                                return 'The page name cannot contain special characters';
                            }
                            if (/^[0-9].*$/.test(input)) {
                                return 'The page name cannot start with a number';
                            }
                            if (input === '') {
                                return 'The page name cannot be empty';
                            }
                            if (input.indexOf('Detail', input.length - 'Detail'.length) !== -1) {
                                return 'The page name cannot end with Detail';
                            }
                            if (!this.jhipsterAppConfig.skipServer && jhiCore.isReservedClassName(input)) {
                                return 'The page name cannot contain a Java or JHipster reserved keyword';
                            }
                            return true;
                        }
                    },
                    {
                        type: 'list',
                        name: 'pageType',
                        message: 'What kind of page do you want to create?',
                        choices: [
                            {
                                value: 'table',
                                name: 'Table page'
                            },
                            {
                                value: 'form',
                                name: 'Form page'
                            }
                        ],
                        default: 0
                    }
                ];

                const done = this.async();

                this.prompt(prompts).then(answers => {
                    this.pageName = answers.pageName;
                    this.pageType = answers.pageType;
                    // To access props answers use this.promptAnswers.someOption;
                    done();
                });
            },
            defaultJhipsterEntityPrompt() {
                this.context = {
                    fields: [],
                    relationships: [],
                    fieldNamesUnderscored: [],
                    entityNameCapitalized: _.upperFirst(this.pageName),
                    ...this.jhipsterAppConfig
                };
                jhipsterEntityPrompt.askForFields.call(this);
            }
        };
    }

    writing() {
        // read config from .yo-rc.json

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

        // show all variables
        this.log('\n--- some config read from config ---');
        this.log(`baseName=${this.baseName}`);
        this.log(`packageName=${this.packageName}`);
        this.log(`clientFramework=${this.clientFramework}`);
        this.log(`clientPackageManager=${this.clientPackageManager}`);
        this.log(`buildTool=${this.buildTool}`);

        this.log('\n--- some function ---');
        this.log(`angularAppName=${this.angularAppName}`);

        this.log('\n--- some const ---');
        this.log(`javaDir=${javaDir}`);
        this.log(`resourceDir=${resourceDir}`);
        this.log(`webappDir=${webappDir}`);

        this.log('\n--- variables from questions ---');
        this.log('------\n');

        // I have to add writing phase inheriting from jhipster

        if (this.clientFramework === 'react') {
            //  this.template('dummy.txt', 'dummy-react.txt');
        }
        if (this.clientFramework === 'angularX') {
            //   this.template('dummy.txt', 'dummy-angularX.txt');
        }
    }

    install() {
        const logMsg = `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        const injectDependenciesAndConstants = err => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            }
        };
        const installConfig = {
            bower: false,
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    }

    end() {
        this.log('End of full-page generator');
    }
};
