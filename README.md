# Wall of Targets

## Getting Started
```bash
# clone our repo
git clone https://github.com/Sage-Bionetworks/WallOfTargets.git

# change directory to our repo
cd WallOfTargets

# WINDOWS only. In terminal as administrator
npm install -g node-pre-gyp
```

## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v6.x.x`+ (or `v7.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

## Installing
Once you have those, you should install these globals with `npm install --global`:
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `typescript` (`npm install --global typescript`)
* `cross-env` (`npm install --global cross-env`)

## Running the app

* Local development environment

For local development you'll need the DynamoDB Local (Downloadable Version). You can get it [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html). It is also important to install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) so we can run the commands we need from outside the project. With everything in place you can check your aws installation with:

```bash
aws --version
```

To connect to your local DynamoDB open a terminal and navigate to the installation folder. Once inside run the following command:

```bash
#change this parameters at will
java -Xms512m -Xmx4000m -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

This will open the database server on port 8000 by default. The `server.js` file is already configured to look for this port on development mode. This project is configured to look for specific tables, so make sure you create them in your local DynamoDB.

* Remote production environment

For deployment you'll need access to an AWS account. You can create one [here](https://aws.amazon.com/free). After creating the account, launch an EC2 instance following this [guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html?icmpid=docs_ec2_console) and install `node` and `npm`. Later we will copy our distribution folder to that EC2 instance. You'll also need to create the tables referenced in this project, so check how to create a table in the AWS console [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleData.CreateTables.html).

When you get everything done, create an IAM user with permissions to handle your AWS resources. It is advised not to use a root account key pair. You can follow this guide to create one following this [guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html). With the IAM user key pair file in hands you can configure your local aws following [these steps](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html). Use the same steps for your EC2 instance (launch the instance and `ssh` with a permission file to connect to it), this way when we run the application from the instance we can get to the Amazon resources.

* Summing-up we have:

> Local development using local DynamoDB and the development mode to build and run the app. The database needs to be started and will be listening on port 8000.

> Remote development using tables created through Amazon console in the DynamoDB section. Here we are going to build our app with the production flag and copy the dist folder to the EC2 instance. We need to connect to the instance and run the app from the remote folder.

> If you are planning on running without AWS

To clean all AWS references, uninstall all the package dependencies related to AWS in the package.json and remove the references within the code.

* Final step

After you have installed all dependencies and got every requirement ready you can run the app. Run `npm run build:dev` and `npm run build:server:dev` to build the files and our server. To run just `npm run server` the port will be displayed to you as `http://0.0.0.0:3000`. This will be our express server listening on port 3000 serving our application. The client configuration run webpack with the `--watch` flag, so any change to the `src/` folder (except the `src/server` folder) will rebuild the application. The server configuration uses the `nodemon-webpack-plugin` when building, so if you run the server with `npm run server`, it will reload if you change files in the `src/server` folder.

Without AWS you can just `npm run server:dev` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://0.0.0.0:3000` (or if you prefer IPv6, if you're using `express` server, then it's `http://[::1]:3000/`).

### build files
```bash
# development
npm run build:dev
npm run build:server:dev
# production (jit)
npm run build:prod
npm run build:server:prod
# AoT
npm run build:aot
npm run build:server:prod
```

### server
```bash
# development AWS
npm run start:server
# production AWS
npm run start:server
# development no AWS
npm run server
# production no AWS
npm run server:prod
```

go to [http://0.0.0.0:3000](http://0.0.0.0:3000) or [http://localhost:3000](http://localhost:3000) in your browser

## Other commands

### hot module replacement
```bash
npm run server:dev:hmr
```

### watch and build files
```bash
npm run watch
```

### run unit tests
```bash
npm run test
```

### watch and run our tests
```bash
npm run watch:test
```

### run end-to-end tests
```bash
# update Webdriver (optional, done automatically by postinstall script)
npm run webdriver:update
# this will start a test server and launch Protractor
npm run e2e
```

### continuous integration (run unit tests and e2e tests together)
```bash
# this will test both your JIT and AoT builds
npm run ci
```

### run Protractor's elementExplorer (for end-to-end)
```bash
npm run e2e:live
```

### build Docker
```bash
npm run build:docker
```

# Configuration
Configuration files live in `config/` we are currently using webpack, karma, and protractor for different stages of your application

# AoT Don'ts
The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

# External Stylesheets
Any stylesheets (Sass or CSS) placed in the `src/styles` directory and imported into your project will automatically be compiled into an external `.css` and embedded in your production builds.

For example to use Bootstrap as an external stylesheet:
1) Create a `styles.scss` file (name doesn't matter) in the `src/styles` directory.
2) `npm install` the version of Boostrap you want.
3) In `styles.scss` add `@import 'bootstrap/scss/bootstrap.scss';`
4) In `src/app/core/core.module.ts` add underneath the other import statements: `import '../styles/styles.scss';`

Since we are using PrimeNG, style rules might not be applied to nested Angular children components. There are two ways to solve this issue enforce style scoping:

* Special Selectors

You can keep the Shadow DOM (emulated browser encapsulation) and still apply rules from third party libraries to nested children with this approach. This is the recommended way, but it is harder to implement in certain scenarios.

```bash
:host /deep/ .ui-paginator-bottom {
    display: none;
}
```

* Disable View Encapsulation

This is the easiest way to apply nested style rules, just go to the component and turn off the encapsulation. This way the rules are passed from parent to children without problems, but any rule created in one component affects the other components. This project uses this approach, so be aware to create style classes with using names related to the current component only.

```bash
...
import { ..., ViewEncapsulation } from '@angular/core';

@Component {
...
encapsulation: ViewEncapsulation.None,
}
```

# TypeScript
> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

## Use latest TypeScript compiler
TypeScript 2.1.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

```
npm install --global typescript
```

## Use a TypeScript-aware editor
We have good experience using these editors:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Webstorm 10](https://www.jetbrains.com/webstorm/download/)
* [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
* [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

### Visual Studio Code + Debugger for Chrome
> Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and see docs for instructions to launch Chrome

The included `.vscode` automatically connects to the webpack development server on port `3000`.

# Types
> When you include a module that doesn't include Type Definitions inside of the module you can include external Type Definitions with @types

i.e, to have youtube api support, run this command in terminal:
```shell
npm i @types/youtube @types/gapi @types/gapi.youtube
```
In some cases where your code editor doesn't support Typescript 2 yet or these types weren't listed in ```tsconfig.json```, add these to **"src/custom-typings.d.ts"** to make peace with the compile check:
```es6
import '@types/gapi.youtube';
import '@types/gapi';
import '@types/youtube';
```

## Custom Type Definitions
When including 3rd party modules you also need to include the type definition for the module
if they don't provide one within the module. You can try to install it with @types

```
npm install @types/node
npm install @types/lodash
```

If you can't find the type definition in the registry we can make an ambient definition in
this file for now. For example

```typescript
declare module "my-module" {
  export function doesSomething(value: string): string;
}
```


If you're prototyping and you will fix the types later you can also declare it as type any

```typescript
declare var assert: any;
declare var _: any;
declare var $: any;
```

If you're importing a module that uses Node.js modules which are CommonJS you need to import as

```typescript
import * as _ from 'lodash';
```

# Deployment

## Docker

To run project you only need host machine with **operating system** with installed **git** (to clone this repo)
and [docker](https://www.docker.com/) and thats all - any other software is not needed
(other software like node.js etc. will be automatically downloaded and installed inside docker container during build step based on dockerfile).

### Install docker

#### MacOS:

`brew cask install docker`

And run docker by Mac bottom menu> launchpad > docker (on first run docker will ask you about password)

#### Ubuntu:

```
sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker  # test:  shoud be ‘active’
```
And add your user to docker group (to avoid `sudo` before using `docker` command in future):
```
sudo usermod -aG docker $(whoami)
```
and logout and login again.

### Build image

Because *node.js* is big memory consumer you need 1-2GB RAM or virtual memory to build docker image
(it was successfully tested on machine with 512MB RAM + 2GB virtual memory - building process take 7min)

Go to main project folder. To build big (~280MB) image which has cached data and is able to **FAST** rebuild
(this is good for testing or staging environment) type:

`docker build -t angular-starter .`

To build **SMALL** (~20MB) image without cache (so each rebuild will take the same amount of time as first build)
(this is good for production environment) type:

`docker build --squash="true" -t angular-starter .`

The **angular-starter** name used in above commands is only example image name.
To remove intermediate images created by docker on build process, type:

`docker rmi -f $(docker images -f "dangling=true" -q)`

### Run image

To run created docker image on [localhost:8080](localhost:8080) type (parameter `-p 8080:80` is host:container port mapping)

`docker run --name angular-starter -p 8080:80 angular-starter &`

And that's all, you can open browser and go to [localhost:8080](localhost:8080).

### Build and Run image using docker-compose

To create and run docker image on [localhost:8080](localhost:8080) as part of large project you may use **docker-compose**. Type

`docker-compose up &`

And that's all, you can open browser and go to [localhost:8080](localhost:8080).


### Run image on sub-domain

If you want to run image as virtual-host on sub-domain you must setup [proxy](https://github.com/jwilder/nginx-proxy)
. You should install proxy and set sub-domain in this way:

 ```
 docker pull jwilder/nginx-proxy:alpine
 docker run -d -p 80:80 --name nginx-proxy -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy:alpine
 ```

 And in your `/etc/hosts` file (linux) add line: `127.0.0.1 angular-starter.your-domain.com` or in yor hosting add
 folowing DNS record (wildchar `*` is handy because when you add new sub-domain in future, you don't need to touch/add any DNS record)

 ```
 Type: CNAME
 Hostname: *.your-domain.com
 Direct to: your-domain.com
 TTL(sec): 43200
 ```

And now you are ready to run image on subdomain by:

```
docker run -e VIRTUAL_HOST=angular-starter.your-domain.com --name angular-starter angular-starter &
```

### Login into docker container

`docker exec -t -i angular-starter /bin/bash`

## Netlify

You can quickly create a free site to get started using this
starter kit in production on [Netlify](https://www.netlify.com/):

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AngularClass/angular-starter)

## Style Guide and Project Structure

This project follows the directions provided by the official [angular style guide](https://angular.io/guide/styleguide). Things that the guide state to keep in mind:

* Define components or services that do one thing only, per file. Try to use small sized functions where possible, making it reusable.

* Keep the consistency in file and folder names. Use dashes to separate words in the descriptive prefix name and dots to separate the suffix words. Use the type and extension names in the file name, e.g. `a.component.ts`, `a.service.ts` or `a.module.ts`. The style guide has references about naming the other types of files in an Angular project.

* The guide advises to use a `main.ts` file for boostrapping, we are using the notation `main.browser.ts` since it was modified for different configurations. It is also a reminder that is where the `platform browser` is.

* Use camel case for variable names, even for constants as they are easy to read. If the values don't change, use a const declaration. For Interfaces use an upper camel case, e.g. `MyInterface`.

* The guide advises separating application from third party imports. This projects goes one step further separating imports by source and purpose also, grouping Angular framework, project components and services, third party typescript/javascript libraries separately.

* The folder structure in not restrictive in the style guide, but it should be structured in a way so it is to maintain and expand the project, and identify files in a glance. This project uses a root folder called `src` and one main folder for each module. When a spacific folder reaches seven or more files it is split into sub-folders. Another reason to split is to keep a view smart component with container dumb components as children.

* For the file structure this project uses the component approach. This is the new standard for developing Angular apps and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class. Here's how it looks:

```
angular-starter/
 ├──config/                        * our configuration
 |   ├──build-utils.js             * common config and shared functions for prod and dev
 |   ├──config.common.json         * config for both environments prod and dev such title and description of index.html
 |   ├──config.dev.json            * config for devevlopment environment
 |   ├──config.prod.json           * config for production environment
 │   │                              (note: you can load your own config file, just set the evn ANGULAR_CONF_FILE with the path of your own file)
 |   ├──helpers.js                 * helper functions for our configuration files
 |   ├──spec-bundle.js             * ignore this magic that sets up our Angular testing environment
 |   ├──karma.conf.js              * karma config for our unit tests
 |   ├──protractor.conf.js         * protractor config for our end-to-end tests
 │   ├──webpack.common.js          * common tasks for webpack build process shared for dev and prod
 │   ├──webpack.dev.js             * our development webpack config
 │   ├──webpack.prod.js            * our production webpack config
 │   ├──webpack.server.js          * our server webpack config
 │   └──webpack.test.js            * our testing webpack config
 │
 ├──src/                           * our source files that will be compiled to javascript
 |   ├──main.browser.ts            * our entry file for our browser environment
 │   │
 |   ├──index.html                    * Index.html: where we generate our index page
 │   │
 |   ├──polyfills.ts                  * our polyfills file
 │   │
 │   ├──app/                          * WebApp: folder
 │   │   ├──charts                    * the charts module main folder, chart specific code
 │   │   ├   |──charts.module.ts      * the charts module file
 │   │   ├   |──services              * the core services folder, to be used by different modules
 │   │   ├   |   |──chart.service.ts  * chart related service, to be used only in this module
 │   │   ├   |   |──...               * other nested files
 │   │   ├   |──...                   * other nested files
 │   │   ├──core                      * the core module main folder, imports the other modules
 │   │   ├   |──core.module.ts        * the core module file, to be imported once by the app module
 │   │   ├   |──services              * the core services folder, to be used by different modules
 │   │   ├   |   |──data.service.ts   * data related service, e.g. loading data into the app
 │   │   ├   |   |──gene.service.ts   * gene related service, e.g. current selected gene
 │   │   ├   |   |──...               * other nested files
 │   │   ├   |──...                   * other nested files
 │   │   ├──models                    * our interface definitions
 │   │   ├   |──gene.ts               * the gene interface
 │   │   ├   |──index.ts              * exports all models
 │   │   ├──shared                    * our shared module main folder, to be imported by other modules
 │   │   ├   |──shared.module.ts      * the shared module file
 │   │   ├   |──...                   * other nested files
 │   │   ├──genes                     * our genes module main folder
 │   │   ├   |──genes.module.ts       * the genes module file
 │   │   ├   |──...                   * other nested files
 │   │   ├──app.component.spec.ts     * a simple test of components in app.component.ts
 │   │   ├──app.e2e.ts                * a simple end-to-end test for /
 │   │   └──app.component.ts          * a simple version of our App component components
 │   │
 │   ├──server/                       * the server related code folder
 │   |   ├──routes/                   * folder with our api routes
 │   │   ├   |──api.js                * exports the api backend routes, connects to AWS
 │   |   └──server.js                 * declares our express server and exports it in production mode
 │   │
 │   └──assets/                       * static assets are served here
 │       ├──icon/                     * our list of icons from www.favicon-generator.org
 │       ├──service-worker.js         * ignore this. Web App service worker that's not complete yet
 │       ├──robots.txt                * for search engines to crawl your website
 │       └──humans.txt                * for humans to know who the developers are
 │
 │
 ├──tslint.json                       * typescript lint config
 ├──typedoc.json                      * typescript documentation generator
 ├──tsconfig.json                     * typescript config used outside webpack
 ├──tsconfig.webpack.json             * config that webpack uses for typescript
 ├──package.json                      * what npm uses to manage its dependencies
 └──webpack.config.js                 * webpack main configuration file
```

# Database

DynamoDB was chosen for this project because it is consistent, single-digit millisecond latency at any scale. It is Amazon's key-value NoSQL database, a fully managed cloud database that supports both document and key-value store models. It works great with the `aws-sdk` and is easy to start developing locally and remotelly.

# License
 [MIT](/LICENSE)
