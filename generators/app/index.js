'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const _ = require('lodash');

module.exports = Generator.extend({
  initializing: function () {
    const done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the minimal ' + chalk.red('Node TypeScript') + ' generator!'
    ));

    this.log(
      chalk.cyan('I simply get down to business of generating, no questions asked!')
      + '\n'
      + chalk.yellow('Libraries you ask? I use npm (or optionally gulp) as task runner and mocha for testing.')
      + '\n'
      + chalk.gray('Can you change these? Of course, it\'s your code. I get out of the way after scaffolding.')
    );

    done();
  },

  writing: {
    dir: function () {
      this.fs.copy(
        this.templatePath('src'),
        this.destinationPath('src')
      );

      if (this.options.mocha) {
        // 2.0.0-beta: copying the spec file needs templating due to the ts-node problem on windows
        // this.directory('test', 'test');
        this.fs.copyTpl(
          this.templatePath('test/greeter-spec_mocha.ts'),
          this.destinationPath('test/greeter-spec.ts'),
          { isWindows: process.platform === 'win32' }
        );
        this.fs.copyTpl(
          this.templatePath('test/index-spec_mocha.ts'),
          this.destinationPath('test/index-spec.ts'),
          { isWindows: process.platform === 'win32' }
        );
      } else {
        this.fs.copyTpl(
          this.templatePath('test/greeter-spec.ts'),
          this.destinationPath('test/greeter-spec.ts')
        );
        this.fs.copyTpl(
          this.templatePath('test/index-spec.ts'),
          this.destinationPath('test/index-spec.ts')
        );
      }
    },

    projectfiles: function () {
      const today = new Date();

      if (this.options.gulp) {
        this.fs.copy(
          this.templatePath('_vscode/tasks_gulp.json'),
          this.destinationPath('.vscode/tasks.json')
        );

        this.fs.copyTpl(
          this.templatePath('_package_gulp.json'),
          this.destinationPath('package.json'),
          { appname: _.kebabCase(path.basename(process.cwd())) }
        );

        this.fs.copy(
          this.templatePath('_gulpfile.js'),
          this.destinationPath('gulpfile.js'),
          { appname: _.kebabCase(path.basename(process.cwd())) }
        );

        this.fs.copy(
          this.templatePath('README_gulp.md'),
          this.destinationPath('README.md')
        );
      } else {
        this.fs.copy(
          this.templatePath('_vscode/tasks.json'),
          this.destinationPath('.vscode/tasks.json')
        );

        if (this.options.mocha) {
          this.fs.copyTpl(
            this.templatePath('_package_mocha.json'),
            this.destinationPath('package.json'),
            { appname: _.kebabCase(path.basename(process.cwd())) }
          );

          this.fs.copy(
            this.templatePath('travis_mocha.yml'),
            this.destinationPath('.travis.yml')
          );
        } else {
          this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            { appname: _.kebabCase(path.basename(process.cwd())) }
          );

          this.fs.copy(
            this.templatePath('travis.yml'),
            this.destinationPath('.travis.yml')
          );

          this.fs.copy(
            this.templatePath('_tsconfig.test.json'),
            this.destinationPath('tsconfig.test.json')
          );
        }

        this.fs.copy(
          this.templatePath('README.md'),
          this.destinationPath('README.md')
        );
      }

      this.fs.copy(
        this.templatePath('_vscode/settings.json'),
        this.destinationPath('.vscode/settings.json')
      );
      this.fs.copy(
        this.templatePath('_tsconfig.json'),
        this.destinationPath('tsconfig.json')
      );
      this.fs.copy(
        this.templatePath('_tslint.json'),
        this.destinationPath('tslint.json')
      );
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('LICENSE'),
        this.destinationPath('LICENSE'),
        { year: today.getFullYear().toPrecision(4) }
      );
    }
  },

  install: {
    npmInstall: function () {
      const generator = this;
      generator.npmInstall(null, { skipInstall: this.options['skip-install'] }, function () {
      });
    }
  }
});
