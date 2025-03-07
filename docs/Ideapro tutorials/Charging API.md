# Charging API (Charging as a Service)

Charging as a Service API provides a powrful capability to service providers to integrate a means of payment without using credit cards or cash involvement. This charging mechanism works purely from the mobile account of the end user.

If it is a prepaid mobile customer, the amount which is being charged through the API request will be reduced from the balance or the amount will be added to the postpaid mobile user's monthly bill.

## CaaS Common Configuration

CaaS API in Ideamart platform consists of various features which will be discussed in this document.

![](https://drive.google.com/uc?id=1vckoFj4PzHX4Q74auUwKLQAglOydomRc)

#### Charging Notification URL

It is quite straight forward when it comes to the common configurations of CaaS API, where the platform only require an endpoint which all the charging notifications should be routed to.

Once every charging request is executed, the platform generates a charging notification accordingly and sends as a report to the developer/service provider so that the charging process has a track record.

#### Enable Query Balance Requests

Query Balance feature is only available for the operators in Sri Lanka. For Smart, Ideamart platform does not support the query balance feature. To understand more about the query balance service and its request, response bodies visit developer documentation here [Query Balance](../Charging_API/index.html#query-balance). This can be a status check before calling the charging API so that service provider can make sure the end user has enough balance to pay for the requirement.

#### Subscription

In order to use charging API, should the end user first subscribe to your application or not?

If you enable this feature, it means that the end user cannot be charged without him/her subscribing for the particular service. If the charging API is to be used several times, enabling subscription would bring additional advantages. But in the case of only one time payment, in scenarios like e-commerce platforms, turning off subscription is more ideal.

## Operator CaaS Configuration

![](https://drive.google.com/uc?id=1npVV27A_b4uM6XqtScgBMa7rWdGIDuvA)

In terms of operator based CaaS configuration, the features are dependant on operator agreements. Here the maximum TPS and TPD are fixed amount and shown for your reference. Unless for a special scenario, these limitations are not altered.

For successful charging operations, below two options should be toggled to 'YES'. These are provided to confirm the platform allows to make debit requests from the mobile accounts of users.

#### Enable Debit Requests

In order for the service providers to charge customer through a direct debit request, this feature has to be toggled to YES.

#### Mobile Account for Operator

To enable the platform to charge from mobile accounts (of end users), need to enable Mobile Account for Operator.

Service Charge percentage depicts the revenue share percentage in between operator and service provider.
