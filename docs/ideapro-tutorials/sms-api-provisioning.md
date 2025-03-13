# SMS API provisioning

This document is about the provisioning of SMS API through Ideamart platform. The features provided by the SMS API, the important factors needs to be rememberd by the service provided when provisioning are briefly explained.

If you select SMS API from the API selection menu in provisioning and click 'Next', you will see the following screen to begin configuring the settings for SMS API.

![SMS common config](https://drive.google.com/uc?id=1CedmOqDsj6JAYuTTK42F4P_RWJPW3Z3o)

## SMS Common Configuration

### Mobile Orignated SMS

In simpler terms. mobile originated explains the text messages originated from the user's mobile device. This setting is to handle the SMS text messages sent by the user to the application in order to receive the specific service defined by the service provider.

It is developer's option to toggle ON/OFF the capability of receiving MO messages depending on the service requirement. If the service is not expected to receive any messages from the user, it is encouraged to toggle it off.

**IMPORTANT**

If the service

1.  is not an exceptional scenario (like a voting) platform which is not possible to use subscription
2.  has no other means of subscription methods like USSD, web subscription methods etc.

then, keeping mobile originated SMS is important since it is the only way a user can subscribe to the service by sending an SMS to the shortcode.

In that case, if the developer has no plans to use any other MO messages sent to the application, you may keep the Message Receiving URL a dummy value.

But, in the case your service requires to receive messages from the user properly and provide any means of response accordingly, it is required to listen and catch the request which will be routed by Ideamart platform to the endpoint by given at **Message Receiving URL** in developer's hosting space.

Sample request body can be found at SMS API developer documentation of this site [SMS API Documentation](../SMS_API/index.html)

Hint: Always **test your mobile originated SMS** before you go to production by saving your listened data to a db and understand the capability of this API.

### Mobile Terminated SMS

Mobile terminated SMS is in simple terms, the text messages received by the end user. This feature is widely used as it is a very valued content delivery method to be used for endless different scenarios.

SMS text message is received by the user, therefore it is mandatory to include a Sender Address in the given space. Sender Address is the phrase the user is seen as the sender of the message in their Messsaging application.

![Sender Address](https://drive.google.com/uc?id=18-pzvIZNoDVAeFRVjYWDWgxk-h5dstCT)

In Sender Address Aliases section, developers can provide more wordings they would prefer to use as Sender Addresses to be changed later on. This field is an optional.

### Enable Delivery Reports

When you send out messages from the application, if the text message is received by the end user successfully, developer can receive a delivery report by turning on this toggle.

If developer toggles this ON, then the platform will need a receiving endpoint which is the Delivery Report URL.

![Delivery report](https://drive.google.com/uc?id=1iQxPm3ifam50nADSjH8iirPsKG4eBKxX)

The request body to handle the delivery report is included in the SMS API developer documentation of this site [SMS API Documentation](../SMS_API/index.html)

### Enable Subscription

If the service

1.  is not an exceptional scenario (like a voting) platform which is not possible to use subscription
2.  has no other means of subscription methods like USSD, web subscription methods etc.

then, it is encouraged to use the subscription API to deliver better customer service.

When all mandatory configurations are completed for SMS common configuration, please proceed with Next to the operator specific configurations.

## Operator SMS configurations

There are two main types of operator based configurations for all APIs. They are basically API related configuration and charging related configuration (if applicable).

![Operator SMS](https://drive.google.com/uc?id=1WF6e_l4yec2_jVyOZWpr510NTglt1bR6)

Operator SMS configuration consist, operator specific details which may change upon the operator which was selected at previous menu.

Based on the developer's selection of Mobile Terminated and Mobile Originated features, this window will show the corresponding configurations.

#### Mobile Originated SMS configuration

For Mobile Originated, key figures which are mandatory to proceed.

**Shortcode** is the provision in our platform for the user to send messages to the platform. Any mobile originated SMS should be dialed to this shortcode which to be received from app end.

**Keyword** is the unique identifier for the application provisioned. Whenever the user sends an SMS to the application, the keyword should be included in order for the platform to identify the app the request should be routed to.

**Mobile Terminated SMS only provides the message frequencies which the developer cannot edit, but upon request, based on the requirement, an Ideamart administrator will do the needful.**

If proceed with 'Next', the wizard will showcase the SMS charging related operator based configurations to provisioning. If the developer has selected multiple operators in selection menu, then it is mandatory to set figures for **all the operator** **based configuration** entries in the wizard.

![SMS charging](https://drive.google.com/uc?id=15S4qjbFSUtqksYWEEMrFGyu8Ubgowa86)

Depending on the selection at SMS common configurations, it is possible to set charging rates for the provisioning for each operator. The figure depicts an instance where only Mobile Terminated setting is being used.
