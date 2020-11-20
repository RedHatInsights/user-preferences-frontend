[![Build Status](https://travis-ci.org/RedHatInsights/user-preferences-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/user-preferences-frontend)

# user-preferences-frontend

This application is for forms for users to change their preferences. If you want to be part of this application please open PR and update `src/config.json`. Each user preferences page uses this config and it will automatically fetch new data driven form schemas based on it.

## Data driven forms

We rely heavily on library called [Data driven forms](https://data-driven-forms.org/), where we use schema to render components in form. Please go to their documentation if you want to enable new user preferences for your application.

## Custom components

We have designed a few custom components to be used when working with data driven forms to properly show some information on screen.

* `DescriptiveCheckbox` this component is for displaying checkbox with title and description.
    - `descriptiveCheckbox` - component name to be used in DDF schema
    - `label` - will be shown as main title
    - `description` - will be shown under `label`
    - `isDanger` - to show title in danger color

## Hide form parts

If your application should be hidden behind some permission checker (similiar to [cloud-services-config#permissions](https://github.com/RedHatInsights/cloud-services-config/tree/ci-beta#permissionsmethod)) you can add `permissions` field to your application in `config.json`. It can either be object with method and list of arguments, or array with method and list of arguments.

The list of all methods can be found [insights-chrome#permissions](https://github.com/RedHatInsights/insights-chrome#permissions) with additional functions:

* `hasLoosePermissions` - for checking if user has at least one of given permissions

```JSON
{
    "email-preference": {
        ...
        "example": {
          "title": "Example",
          "permissions": {
              "method": "hasPermissions",
              "args": [
                  ["app:action:create"]
              ]
          }
        },
    }
}
```

## Application config

To enable your form parts in user preferences we need at least the application name and its title.

By default this application will try to fetch DDF schema on `/api/${appName}/v1/user-config/${prefType}` where `appName` is ket from `config.json` and `prefType` is defined by each preference. If however you want to change the URL where you serve this schema you are free to do so by setting these fields in your app config.

* `apiName` - this will serve as `appName` when fetching DDF schema `/api/${apiName}/${apiVersion}/user-config/${prefType}`
* `url` - this will completely change how URL is structured `api/${appName}/v1/${url}`
* `apiVersion` - this will change version of your API so the URL will look like `/api/${appName}/${apiVersion}/user-config/${prefType}`

And of course you can combine these values together so if your schema is being served on `/api/example/v2/some-custom/url/with/nested/parts` your config should look like (no need to match object key with apiName)

```JSON
{
    "example-app": {
        "title": "Example app",
        "url": "/some-custom/url/with/nested/parts",
        "apiName": "example",
        "apiVersion": "v2"
    }
}
```

## Dev Instructions

* `npm install`
* Run both `npm run start` & `SPANDX_CONFIG=path/to/user-preferences-frontend/profiles/local-frontend.js sh path/to/insights-proxy/scripts/run.sh`
