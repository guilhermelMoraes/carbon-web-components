/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const { setup: setupDevServer, teardown: teardownDevServer } = require('jest-dev-server');
const exec = require('../exec');
const replaceDependencies = require('../replace-dependencies');

const PORT = 8082;

describe('Basic example', () => {
  beforeAll(async () => {
    const projectRoot = path.resolve(__dirname, '../../..');
    const src = path.resolve(projectRoot, 'examples/codesandbox/vue');
    const tmpDir = process.env.CCE_EXAMPLE_TMPDIR;
    await fs.copy(src, `${tmpDir}/vue`);
    await replaceDependencies([`${tmpDir}/vue/package.json`]);
    await exec('yarn', ['install'], { cwd: `${tmpDir}/vue` });
    await setupDevServer({
      command: `cd ${tmpDir}/vue && yarn serve --port ${PORT}`,
      launchTimeout: Number(process.env.LAUNCH_TIMEOUT),
      port: PORT,
    });
    await page.goto(`http://localhost:${PORT}`);
  }, Number(process.env.LAUNCH_TIMEOUT));

  it('should show a title', async () => {
    await expect(page).toMatch('Hello World!');
  });

  it('should have dropdown interactive', async () => {
    await expect(page).toClick('bx-dropdown');
    await expect(page).toMatchElement('bx-dropdown[open]');
    await expect(page).toClick('bx-dropdown');
    await expect(page).toMatchElement('bx-dropdown:not([open])');
  });

  afterAll(async () => {
    await teardownDevServer();
  });
});
