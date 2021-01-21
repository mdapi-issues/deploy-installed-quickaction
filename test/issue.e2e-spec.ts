import { expect } from 'chai';
import util = require('util');
import child_process = require('child_process');
const exec = util.promisify(child_process.exec);

describe('issue', function () {
  this.timeout('1m');
  before(async () => {
    await exec(
      'npx sfdx force:source:retrieve -m QuickAction:mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate'
    );
  });
  it('succeeds to deploy the same installed QuickAction', async () => {
    const { stdout } = await exec(
      'npx sfdx force:source:deploy -m QuickAction:mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate'
    );
    expect(stdout).to.match(
      /mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate/
    );
  });
  it('fails to deploy an updated installed QuickAction', async () => {
    await exec(
      `perl -p -i -e 's|<uiBehavior>Edit</uiBehavior>|<uiBehavior>Required</uiBehavior>|' force-app/main/default/quickActions/mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate.quickAction-meta.xml`
    );
    let error;
    try {
      await exec(
        'npx sfdx force:source:deploy -m QuickAction:mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate'
      );
    } catch (e) {
      error = e;
    }
    expect(error).not.to.be.undefined;
    expect(error.stderr).to.match(/Deploy failed/);
    expect(error.stdout).to.match(
      /Cannot modify managed object.*field=OptionsCreateFeedItem/
    );
  });
  after(async () => {
    await exec(
      'rm -f force-app/main/default/quickActions/mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate.quickAction-meta.xml'
    );
  });
});
