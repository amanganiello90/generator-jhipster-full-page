const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const jhipsterUtils = require('generator-jhipster/generators/utils');

const SERVER_MAIN_SRC_DIR = jhipsterConstants.SERVER_MAIN_SRC_DIR;
const SERVER_TEST_SRC_DIR = jhipsterConstants.SERVER_TEST_SRC_DIR;

const files = {
    serverMain: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/EntityResource.java',
                    renameTo: generator => `${generator.packageFolder}/web/rest/${generator.entityClass}Resource.java`
                },
                {
                    file: 'package/service/EntityService.java',
                    renameTo: generator => `${generator.packageFolder}/service/${generator.entityClass}Service.java`
                },
                {
                    file: 'package/service/impl/EntityServiceImpl.java',
                    renameTo: generator => `${generator.packageFolder}/service/impl/${generator.entityClass}ServiceImpl.java`
                },
                {
                    file: 'package/service/dto/EntityDTO.java',
                    renameTo: generator => `${generator.packageFolder}/service/dto/${generator.asDto(generator.entityClass)}.java`
                }
            ]
        }
    ],
    serverTest: [
        {
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/service/dto/EntityDTOTest.java',
                    renameTo: generator => `${generator.packageFolder}/service/dto/${generator.asDto(generator.entityClass)}Test.java`
                }
            ]
        }
    ]
};

function writeFiles() {
    return {
        writeServerFiles() {
            if (this.skipServer) return;

            // write server side files
            this.writeFilesToDisk(files, this, this.fetchFromInstalledJHipster('templates/server'));
        },

        writeEnumFiles() {
            this.fields.forEach(field => {
                if (field.fieldIsEnum === true) {
                    const fieldType = field.fieldType;
                    const enumInfo = jhipsterUtils.buildEnumInfo(field, this.angularAppName, this.packageName, this.clientRootFolder);
                    if (!this.skipServer) {
                        this.template(
                            `${this.fetchFromInstalledJHipster(
                                'templates/server'
                            )}/${SERVER_MAIN_SRC_DIR}package/domain/enumeration/Enum.java.ejs`,
                            `${SERVER_MAIN_SRC_DIR}${this.packageFolder}/domain/enumeration/${fieldType}.java`,
                            this,
                            {},
                            enumInfo
                        );
                    }
                }
            });
        },
        writeClientFiles() {}
    };
}

module.exports = {
    writeFiles
};
