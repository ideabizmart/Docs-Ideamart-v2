# Subscription API

Subscription API allows to keep end users bound to the service and maintain other functionalities accordingly.

This API maintains the subscription, the consent of user being registered to the application.

In this documentation, the following services offered by the APIs are included.

1.  Regiseter/Unregister service
2.  Subscription notification
3.  Subscription status service
4.  Query base service

## Register/Unregister service

This service allows the registration or unregistration to be performed. It is a must to use this service based on end user consent, or in the case of failure to adhere may cause in application suspension.

#### URL

	
		 `https://api.ideamart.io/subscription/send` 

#### Content Type

	
		 `application/json` 

#### Method

	
		 `POST` 

### Request

Sample request of register service is below.

	
		 ```{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242",
  "version": "1.0",
  "action": "1",
  "subscriberId": "tel:***************"
}``` 

Sample request of unregister service is below.

	
		 ```{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242",
  "version": "1.0",
  "action": "0",
  "subscriberId": "tel:94771234567"
}``` 

### Response

Sample response of register service is below.

	
		 ```{
  "version": "1.0",
  "requestId": "1374746416574",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS",
  "subscriptionStatus": "REGISTERED"
}``` 

Sample response of unregister service is below.

	
		 ```{
  "version": "1.0",
  "requestId": "1374746416574",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS",
  "subscriptionStatus": "UNREGISTERED"
}``` 

### More information on Register/Unregister service

Following are all the request parameters of the register/unregister service.

|  
Parameter Name  
|  
Description  
|  
Type  
|  
Mandatory /Optional  
|
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|-------------------------------------------------------------------------|
| applicationId | Application ID as received when provisioned | String | Mandatory |
| password | Password as received when provisioned | String | Mandatory |
| version | API version shall be numbered as 1.0, 2.0 etc | String | OptionalIf not specified shall be validated against the latest version. |
| action | Whether the subscriber is toopt in or opt out | Enumerated0 – Opt Out1 – Opt In | Mandatory |
| subscriberId | Telephone number of the user to be subscribed.tel – for MSISDNeg: tel:94771234567Note: tel might be a masked number depending on the application  
| String | Mandatory |

Following are all the response parameters of register/unregister service.

|  
Parameter Name  
|  
Description  
|  
Type  
|  
Mandatory / Optional  
|
|-----------------------------------|---------------------------------------------------------------------------------|-------------------------|-----------------------------------------|
| version | API version shall be numbered as 1.0, 2.0 etc | String | Will be specified always |
| requestId | Request ID to uniquely identify the request within the SDP | String | Will be specified always |
| statusCode | The status code for the entire request | String | Will be specified always |
| statusDetail | The status detail for the entire request | String | Will be specified always |
| subscriptionStatus | Enum:REGISTERED, UNREGISTERED ,PENDING CHARGE – Subscriber is not charged yet. | Enum | Optional |

## Subscription Notification Service

Subscription Notification service provides information related to the particular subscription when a user subscribes to the application.

This notification may be captured in the subscription receiver fixed under 'Subscription Notification URL' in provisioning.

Sample request of subscription notification service is below.

	
		 ```{
  "applicationId": "APP_001807",
  "frequency": "Monthly",
  "status": "REGISTERED",
  "subscriberId": "tel:94771234567",
  "version": "1.0",
  "timeStamp": "20130402025896"
}``` 

## Subscription Status Service

This service can be used to check the subscription status of a given MSISDN.

#### URL

	
		 `https://api.ideamart.io/subscription/getStatus` 

#### Content Type

	
		 `application/json` 

#### Method

	
		 `POST` 

### Request

Sample request of subscription status service is below.

	
		 ```{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242",
  "subscriberId": "te:94771234567"
}``` 

### Response

Sample repsonse of subscription status service is below.

	
		 ```{
  "version": "1.0",
  "subscriptionStatus": "REGISTERED",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS"
}``` 

### More information on Subscription Status Service

Following are the request parameters of subscriptoin status service.

|  
Parameter Name  
|  
Description  
|  
Type  
|  
Mandatory / Optional  
|
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------|-------------------------|-----------------------------------------|
| applicationId | Application ID as received when provisioned. | string | Mandatory |
| password | Password as received when provisioned. | string | Mandatory |
| subscriberId | Address of the subscriberEg: tel:94771234567Note:  
might be a masked number depending on the application  
| string | Mandatory |

Following are the response parameters of subscription status service.

|  
Parameter Name  
|  
Description  
|  
Type  
|  
Mandatory / Optional  
|
|-----------------------------------|-------------------------------------------------------------|-------------------------|-----------------------------------------|
| version | API version shall be numbered as 1.0, 2.0 etc | String | Mandatory |
| subscriptionStatus |  
REGISTERED /UNREGISTERED/PENDING /CHARGE  
| String | Optional |
| statusCode | The error code for the entire request | String | Mandatory |
| statusDetail | The error detail for the entire request | String | Mandatory |

## Query Base Service

This service provides the number of subscribers registered to a given application.

#### URL

	
		 `https://api.ideamart.io/subscription/query-base` 

#### Content Type

	
		 `application/json` 

#### Method

	
		 `POST` 

### Request

Sample request of Query base service is below.

	
		 ```{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242"
}``` 

### Response

Sample response of Query base service is below.

	
		 ```{
  "version": "1.0",
  "baseSize": "10",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS"
}``` 

### More information on Query Base Service

Following are the request parameters of query base service.

|  
Parameter Name  
|  
Description  
|  
Type  
|  
Mandatory / Optional  
|
|-----------------------------------|---------------------------------------------|-------------------------|-----------------------------------------|
| applicationId | Application ID as received when provisioned | string | Mandatory |
| password | Password as received when provisioned | string | Mandatory |

Following are the response parameters of query base service.

|  
Parameter Name  
|  
Description  
|  
Type  
|  
Mandatory / Optional  
|
|-----------------------------------|-----------------------------------------------|-------------------------|-----------------------------------------|
| version | API version shall be numbered as 1.0, 2.0 etc | String | Mandatory |
| baseSize | The current subscribers base size | String | Optional |
| statusCode | The status code for the entire request | String | Mandatory |
| statusDetail | The status detail for the entire request | String | Mandatory |
