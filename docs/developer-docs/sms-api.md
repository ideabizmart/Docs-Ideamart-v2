# SMS API

The SMS REST Service provides operations for sending an SMS to Ideamart platform and to receive an SMS from the platform.

The SMS Interface allows applications to send and receive SMS messages using an HTTP-based API.

Supported services are as follows:

-   **Send Service** This is for the mobile application to send messages to subscribed users. Also known as MT (Mobile Terminated).
    
-   **Receive Service** This service is to retrieve the SMS sent to the application by any user.
    
-   **Status Report Service** If an application had requested for a status report from Ideamart, then the platform will initiate the status report service to hand over the report to the application.
    

### URL

	
`https://api.ideamart.io/sms/send` 

### Content Type

	
`application/json` 

### Method

	
`POST` 

## Send Service

This service lets the user send SMS to one or more terminals (phones or any SMS-enabled device) from their application. An application wishing to initiate an MT SMS message should use this operation type.

### Request

Below is a sample request of send service.

	
```
{
    "message":"Hello",
    "destinationAddresses":["tel:*************"],
    "password":"password",
    "applicationId":"APP_999999"
}
```

### Response

	
```
{
    "statusCode":"S1000",
    "statusDetail":"Success",
    "messageId":"MSG_000111",
    "version":"1.0"
}
``` 

### More information on send service.

Following are all the request parameters of send service.

| Parameter Name | Description | Type | Mandatory /Optional |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| application ID | Application ID as given when provisioned. | String | Mandatory |
| password | Password given when provisioned. | String | Mandatory |
| version | API version shall be numbered as 1.0, 2.0 etc. | String | OptionalIf not specified shall be validated against the latest version. |
| destination Address | List of destination addresses should be Hash Codes.tel: for MSISDNtel: 5C74B588F97,tel: 5C74B588F97Address can also have the value – "tel: all" which will in turn be a message to the subscribed base of the application.Note : tel might be a masked number depending on the type of application  
| String | At least one need to be specified. |
| message | The message that need to be sent, Messages over the limit shall be broken up. | String | Mandatory |
| sourceAddress | The sender address to be shown – can be one of the provisioned values in alias list. | String | Optional |
| delivery Status Request | To indicate the need of Delivery Status Report for the message. | Enumerater 0-DeliveryReportNotRequired 1- DeliveryReportRequired | OptionalIf not specified shall be assumed to be a request without the need for Delivery Report. |
| encoding | Encoding scheme used in the message. | Enumerated0 – Text240 – Flash SMS245 – Binary SMS | Optional. If not specified taken as Text. If the encoding type is “Binary” then the message content will be represented as hex encoded. |
| Charging Amount | Charging amount specified for variable charging applications only. | Number to 2 decimal places-shall be considered only in system currency.E.g. 78.05 | Optional |
| binary Header | For advanced type messages where the binary header shall be sent from the application. | Hexadecimal String | Optional |

Comprehensive send request with all the parameters

			
				 ```{
    "message" :"Hello",
    "password":"password",
    "sourceAddress":"77000",
    "deliveryStatusRequest":"1",
    "chargingAmount":":15.75",
    "destinationAddresses":["tel:************"],
    "applicationId":"APP_999999",
    "encoding":"245",
    "version":"1.0",
    "binaryHeader":"526574697265206170706c69636174696f6e20616e642072656 c6561736520524b7320696620666f756e642065787069726564", 
}``` 

Following are all the response parameters of send service.

| Parameter Name | Description | Type | Mandatory /Optional |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|---------------------|
| version | API version shall be numbered as 1.0, 2.0 etc. If version was specified in request, same version must be sent in response.If version was not specified in request, then latest version will be specified in response. | String | Mandatory |
| requestId | requestId to uniquely identify the request within the Ideamart | String | Mandatory |
| statusCode | The status code for the entire request | String | Mandatory |
| statusDetail | The status detail for the entire request | String | Mandatory |
| destinationResponses | The list of responses for the full list of addresses. It will be a collection with individual entry for each element in the address list of the request.AddresstimeStamp – Processed Time stampmessageId – Message IdentifierstatusCode – Status CodestatusDetail – Status detailE.g. given below | String | Mandatory |

Smaple sample response

			
				 ```{
    "statusCode":"S1000",
    "statusDetail":"Success",
    "messageId":"MSG_000111",
    "version":"1.0"
}``` 

Comprehensive destination response:

			
				 ```{
    "destinationResponses": [
        {
            "timeStamp": "20190807100523",
            "address": "tel:*********************",
            "messageId": "21908071005227014",
            "statusDetail": "Request was successfully processed.",
            "statusCode": "S1000"
        }
    ],
    "requestId": "21908071005227014",
    "statusDetail": "Request was successfully processed.",
    "version": "1.0",
    "statusCode": "S1000"
}``` 

## Receive service

The message sent by the user to the application is received by this service. Once a message is received, this service returns only a list of SMS messaegs since the previous invocation of the method to receive SMS.

### Request

Following is a sample request for a receive service.

			
				 ```{
    "message":"my testing message",
    "sourceAddress":"tel:***************",
    "requestId":"APP_000001",
    "encoding":"0",
    "version":"1.0"
}``` 

### Response

Sample response of receive service

			
				 ```{
    "statusCode":"E1308",
    "statusDetail":"Error during the charging operation"
}``` 

### More information on Receive service

Following are the request parameters of receive service.

|  
Parameter Name  
|  
Description  
|  
Type  
|  
Mandatory /Optional  
|
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|--------------------------------------------|
| version | API version shall be numbered as 1.0, 2.0 etc | String | Mandatory |
| applicationId | Application ID as given when provisioned | String | Mandatory |
| sourceAddress | Source address is a masked number. | String | At least one will be specified |
| message | Message as sent from the user | String | Mandatory |
| requestId | Request Identifier in the Ideamart | String | Mandatory |
| encoding | Encoding scheme used in the Message.If the encoding type is “Binary” then the message content will be represented as hex encoded. | Enumerated0 – Text240-Flash245 – Binary | Mandatory |

Comprehensive sample request

						
							 ```{
    "message":"my testing message from app1",
    "sourceAddress":"tel:*************", 
    "requestId":"APP_000001",
    "encoding":"0", 
    "version":"1.0"
}``` 

Following are the response parameters of receive service.

| Parameter Name | Description | Type | Mandatory/Optional |
|----------------|-----------------------------------------|--------|--------------------|
| statusCode | The error code for the entire request | String | Mandatory |
| statusDetail | The error detail for the entire request | String | Mandatory |

​

## Delivery Status Report Service

When performing a Send SMS Operation, in the case which an application had requested for a Delivery Response message from the Message Centre, then the Ideamart platform will initiate the Delivery Report service to hand over the Delivery Response message to the application. The requestId should be used to match the MT response with the Delivery Report.

### Request

Following is a sample request of delivery status report service.

						
							 ```{
    "destinationAddress":"tel:************",
    "timeStamp":"20120113082110", 
    "requestId":"MSG_000111",
    "deliveryStatus":"DELIVERED"
}``` 

### Response

Following is a sample request of delivery status report service.

						
							 ```{
    "statusCode":"S1000",
    "statusDetail":"Success"
}``` 

### More information on Delivery Status Report service

Request parameters of status report service are below.

| Parameter Name | Description | Type | Mandatory /Optional |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|---------------------|
| destination Address | Address of the subscriberE.g. tel: 5C74B588F97 | String | Mandatory |
| time Stamp | The timestamp sent from the SMS “yyMMddHHmm”yy – last two digits of the year (00-99)MM – month (01-12)dd – day (01-31)HH – hour (00-23)mm- minute (00-59) | String | Mandatory |
| requestId | requestId to uniquely identify the request within the Ideamart | String | Mandatory |
| delivery Status | Enum From SMPP Gateway : DELIVRD,EXPIRED, DELETED, UNDELIV, ACCEPTD,UNKNOWN, REJECTDEnum from Ideamart to Application:DELIVERED, EXPIRED, DELETED,UNDELIVERABLE, ACCEPTED,UNKNOWN, REJECTED | String | Mandatory |

Comprehensive sample request

						
							 ```{
    "destinationAddress":"tel:***************", 
    "timeStamp":"20120113082110", 
    "requestId":"MSG_000111", 
    "deliveryStatus":"DELIVERED"
}``` 

Response parameters of status report service are below.

| Parameter Name | Desscription | Type | Mandatory/Optional |
|----------------|------------------------------------------|--------|--------------------|
| statusCode | The status code for the entire request | String | Mandatory |
| statusDetail | The status detail for the entire request | String | Mandatory |
