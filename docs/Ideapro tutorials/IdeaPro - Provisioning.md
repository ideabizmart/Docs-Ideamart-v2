# IdeaPro - Provisioning

**Things to be ready by now**

-   Model of application you are going to build
-   Decision on what APIs and operators to provision based on your requirement
-   Decision on charging amounts, reasons and frequencies
-   Hosting space for your code files to be accessed by the platform
-   Code files related to your application to handle the responses or SMSs sent to the application

Go to portal.ideamart.io. Select your country and login with your credentials to view your Ideamart dashboard.

Select IdeaPro, click on 'Create new App'

For starters, it is required to fill out the basic details below.

## Basic Details

![Basic Details](https://drive.google.com/uc?id=1gxIbUNq6TJrDzbBltuKEn4_YXH2pzNam)

### Application Name

This is the unique name given to the application. It is required that this name to be unique.

### Application Description

This description is entirely for the administrative requirements to support approval process. Developers should provide an adequate and specific description about the application.

### Allowed Host Addresses

This is the host address from Ideamart end to receive the request the application is making. To receive the host IP address ping the host URL.

Use below curl from server to view your IP address.

`curl -4  https://myip.ideamart.io` 

Based on your requirement, you may add more than one host address to this field.

### Whitelisted Numbers

After the provisioning, the application must be approved by an administrator. First approval will be granted as **Limited Production**.

In limited production state, application is only allowed to be tested by the numbers whitelisted here. This is for testing purposes.

### Blacklisted numbers

Blacklisted numbers will not be able to test the application.

## Advanced Details

#### ![Advanced Details](https://drive.google.com/uc?id=1ssyA-DPsmLwRZTU-kQIw1pClx7xO5HZ-)

#### Enable automatic content governance

Content pushed through the application are governed for inappropriate wording.

#### Enable Advertisements

Opt to enable advertisement attached to content sent to users via messages.

#### Enable Mobile number masking

The platform has a feature to convert the mobile numbers of the subscribers of your application into a hash key for privacy concerns.

The developer **will not** see the true MSISDN of the subscriber.

#### Application start time

You can set a start time for your application based on your requirement.

#### Application expiration

If the application requires an automatic expiration time, this can be enabled and time can be set accordingly.

## Services

![Operator selection](https://drive.google.com/uc?id=1IGmh27JWBZ6GlSG7v4uJ_kbJUaR3vtle)

If Operators and relevant APIs are selected, settings for each API for each operator can be configured under Settings.

Check relevant documentation to learn about provisioning the corresponding APIs which were selected by developer.
