# deploy-installed-quickaction

> **UPDATE: This issue has been resolved probably in the Summer 21 Release**

> ~~Minimal working example to demonstrate a bug in deploy and updateMetadata where installed QuickActions cannot be updated~~

[![Actions Status](https://github.com/mdapi-issues/deploy-installed-quickaction/workflows/Test%20and%20Release/badge.svg)](https://github.com/mdapi-issues/deploy-installed-quickaction/actions)

## Steps to reproduce the issue

Clone this repository.

Create a scratch org and install a dummy managed package

```console
yarn
yarn develop
```

Retrieve an installed QuickAction

```console
sfdx force:source:retrieve -m "QuickAction:mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate"
```

Change the `uiBehaviour` to `Required` and try to deploy the installed QuickAction

```console
perl -p -i -e 's|<uiBehavior>Edit</uiBehavior>|<uiBehavior>Required</uiBehavior>|' force-app/main/default/quickActions/mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate.quickAction-meta.xml
sfdx force:source:deploy -m "QuickAction:mdapidummy2gen__Vehicle__c.mdapidummy2gen__Deprecate"
```

Notice the error message saying

> [CANNOT_MODIFY_MANAGED_OBJECT] Cannot modify managed object: entity=QuickActionDefinition, component=09D0V000001Da5y, **field=OptionsCreateFeedItem**, state=installed

but we did not change the `OptionsCreateFeedItem` field.

Applying this change using a the Setup Menu just works fine.
