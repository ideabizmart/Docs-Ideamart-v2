# Charging API

CaaS - Charging as a Service API allows the service provider to perform query balance and charge a specific amount from the end user.

P.S - It is a must to use a pre-defined specific amount to charge from the end user, which should also be communicated to the end user prior to the registration.

In this documentation, following services offered by the API are found.

-   Query Balance
-   Direct debit

## Query Balance

This service provides the remaining balance amount of a desired user with other related information of the user account.

**This service is still not availabe under Ideamart by Smart for Smart Axiata service providers**

#### URL
```
https://api.ideamart.io/caas/balance/query
```

#### Content Type
```
application/json
```

#### Method
```
POST
```

### Request

Sample request of balance query is below.
```
{
    "applicationId":"APP_000018", 
    "password":"95904999aa8edb0c038b3295fdd271de", 
    "subscriberId":"************"
}
``` 

### Response

Sample response of balance query is below.
```
{
    "chargeableBalance":"300.0", 
    "statusCode":"S1000", 
    "statusDetail":"Success", 
    "accountStatus":"Active", 
    "accountType":"Pre Paid"
}
``` 

### More information on Balance Query service

Following are all the request parameters of the balance query service.

| Parameter Type | Description                                                                                                                                            | Type   | Mandatory/Optional |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|--------|--------------------|
| applicationId  | Used to identify the application. This is a unique identifier generated while provisioning an application.                                             | String | Mandatory          |
| password       | Used to authenticate the application originated message against the service providers credentials. Encoded, single value                               | String | Mandatory          |
| subscriberId   | This can be the MSISDN or the Username of the subscriber whose account balance is being queried                                                        | String | Mandatory          |
| accountId      | The account of the payment instrument. Only a single value can be sent per request                                                                     | String | Optional           |
| currency       | The currency of the charged amount. Only a single value is allowed, and must be in 'LKR' since service is only available for Dialog, Airtel and Hutch. | String | Optional           |

Below is a comprehensive sample of the balance query request.

		
```
{
    "applicationId":"APP_000018", 
    "password":"95904999aa8edb0c038b3295fdd271de", 
    "subscriberId":"94776351232",                       
    "accountId":"12345",
    "currency":"LKR"
}
``` 

Following are all the response parameters of balance query service.

| Parameter         | Description                                                                                                                                                                           | Type   | M/O | 
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|-----| 
| accountType       | Account type of the subscriber id. (Prepaid/Postpaid for GSM domain)                                                                                                                  | String | M   | 
| accountStatus     | Account status of the subscriber ID                                                                                                                                                   | String | M   |
| statusCode        | Status of the operation. Only a single set of elements can be sent per request.                                                                                                       | String | M   |
| statusDetail      | The textual description of the operation's status.                                                                                                                                    | String | M   |
| chargeableBalance | Available chargeable balance of the subscriber.Refers to either remaining account balance (prepaid user) or the difference between credit limit and outstanding bill (postpaid user). | String | M   |

Below is a comprehensive sample for the balance query response.

```
{
 "chargeableBalance":"300.0", 
 "statusCode":"S1000", 
 "statusDetail":"Success", 
 "accountStatus":"Active", 
 "accountType":"Pre Paid"  
}
``` 

## Direct Debit

This is used to charge a specific amount from the subscriber's account for the service provided. This amount has to be communicated to the user prior to subscription.

### URL

```
https://api.ideamart.io/caas/direct/debit
```

### Content Type
```
application/json
```

### Method
```
POST
```

### Request

Following is a sample request for direct debit service.

```
{   
    "applicationId":"APP_000017", 
    "password":"95904999aa8edb0c038b3295fdd271de",
    "externalTrxId":"12345678901234567890123456789012",
    "subscriberId":"tel:************",
    "accountId":"123456",
    "currency":"USD",
    "amount":"1"
}
``` 

### Response

Following is a sample response for direct debit service.

```
{
    "statusCode":"S1000", 
    "timeStamp":"2012-07-30T12:48:10-0400",
    "shortDescription":"Long Description",
    "statusDetail":"Success",
    "externalTrxId":"12345678901234567890123456789012",
    "longDescription":"short Description",
    "internalTrxId":"321"   
}
``` 

### More information on Direct Debit

Following are all the request parameters of the direct debit service.

| Parameter         | Description                                                                                                       | Type   | M/O |
|-------------------|-------------------------------------------------------------------------------------------------------------------|--------|-----|
| applicationId     | Used to identify the application. This is a unique identifier generated when provisioning an application.         | String | M   |
| password          | Used to authenticate the application originated message against the service providers credentials.                | String | M   |
| externalTrxId     | This is the transaction ID generated by the application to map the request with the response.                     | String | M   |
| subscriberId      | This is the MSISDN of the subscriber to be charged. This is a unique identifier. The hash key of the charged user | String | M   |
| accountId         | The account of the payment instrument.                                                                            | String | O   |
| amount            | Amount to be reserved for charging.                                                                               | String | M   |
| currency          | The currency of the amount. Optional, but if not 'LKR', must be specified which currency it is.                   | String | O   |
| paymentInstrument | The account which the debit should be performed on.                                                               | String | M   |

Below is a comprehensive sample for the direct debit request.
```
{
    "applicationId":"APP_000017",
    "password":"95904999aa8edb0c038b3295fdd271de",
    "externalTrxId":"12345678901234567890123456789012",
    "subscriberId":"94776351232",
    "accountId":"123456",
    "paymentInstrument":"MobileAccount"
    "currency":"USD",
    "amount":"1"
}
``` 

Following are all the response parameters of the direct debit service.

| Parameter     | Description                                                                                                                         | Type                        | M/O |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-----|
| externalTrxId | The transaction ID generated by the application to map the request with the response.                                               | String                      | M   |
| internalTrxId | Internal Transaction ID generated by the Payment Gateway for the transaction. This is unique for a transaction                      | String                      | M   |
| referenceId   | Unique number generated by the system for the payment request. This is required to be entered in the external charging system/menu. | 8 digits                    | O   |
| timeStamp     | System date and time of success or failed transaction.                                                                              | Date/Time string (ISO-8601) |
| statusCode    | Status of the operation.                                                                                                            | String                      | M   |
| statusDetail  | The textual description of the operation status                                                                                     | String                      | M   |

Below is a comprehensive sample for the direct debit response.

```
{
    "statusCode":"S1000", 
    "timeStamp":"2012-07-30T12:48:10-0400", 
    "shortDescription":"short Description", 
    "statusDetail":"Success", 
    "externalTrxId":"12345678901234567890123456789012", 
    "longDescription":"Long Description", 
    "internalTrxId":"321"
}
```
