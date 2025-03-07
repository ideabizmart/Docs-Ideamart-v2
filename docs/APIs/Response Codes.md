﻿# Response Codes

Ideamart provides comprehensive responses in cases of not being able to complete the requests successfully.

Below is the complete list of error and response codes which will be responded by Ideamart platform.

## Complete Error Codes list
| Error   | Description                                                                                                                                   |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| E1301   | Requested ApplicationID is not allowed within the System                                                                                      |
| E1302   | Requested SP is not allowed within the System                                                                                                 |
| E1303   | IP address, which the request originates from, is not listed within the allowed-host-address list                                             |
| E1304   | Requested Application is not found within the System                                                                                          |
| E1305   | Requested ApplicationID is invalid                                                                                                            |
| E1306   | Routing Key (shortcode/ keyword) for the NCS service is invalid                                                                               |
| E1307   | Requested SP is not found within the System                                                                                                   |
| E1308   | Error during the charging operation                                                                                                           |
| E1309   | Requested service is not allowed for this Application                                                                                         |
| E1310   | MO flow is not allowed for this Application                                                                                                   |
| E1311   | MT flow is not allowed for this Application                                                                                                   |
| E1312   | Invalid request                                                                                                                               |
| E1344   | Sorry, your SMS  sent to {0} application could not be processed. Please check if you have sufficient balance and try again.                   |
| E1313   | Authentication failure. There is no active application, or no active service provider or given password in the request is invalid.            |
| E1315   | Requested NCS service is not available                                                                                                        |
| E1316   | Sorry, the {0} application is temporarily  unavailable. Please try again later.                                                               |
| E1317   | MSISDN which is in the request is in invalid state.(MSISDN may be in a Blocked State, MSISDN may have invalid length of digit                 |
| E1342   | Sorry, Your phone number is blacklisted to use this application {0}                                                                           |
| E1343   | Non white listed mobile number accessing services of application {0}                                                                          |
| E1318   | Sorry, the {0} application is temporarily  unavailable. Please try again later.                                                               |
| E1319   | Sorry, the {0} application is temporarily  unavailable. Please try again later.                                                               |
| E1340   | Invalid request - {0}                                                                                                                         |
| E1322   | Requested sender is not allowed                                                                                                               |
| E1323   | Requested recipients not allowed                                                                                                              |
| E1324   | Subscription via HTTP is not allowed                                                                                                          |
| E1325   | Format of the address is invalid                                                                                                              |
| E1326   | Sorry, your SMS  sent to {0} application could not be processed. Please check if you have sufficient balance and try again.                   |
| E1327   | App id not allowed in pgw                                                                                                                     |
| E1328   | Charging operation not allowed. Please check the NCS configuration.                                                                           |
| E1329   | Charging amount too high. Please check the NCS configuration.                                                                                 |
| E1330   | Charging amount too low. Please check the NCS configuration.                                                                                  |
| E1331   | Sorry, invalid/unauthorized source address. Please check the availability of default sender address or aliases for SMS-MT in {0} application. |
| E1332   | Delivery failed                                                                                                                               |
| E1341   | Delivery failed. Errors occurred while sending the request for the intended destinations                                                      |
| E1333   | Message contain suspective abusive content or subscriber base is larger than limit, will be stored for admin approval                         |
| E1334.0 | request.max-message-length                                                                                                                    |
| E1334   | Message length is too long. Maximum message length is {0}                                                                                     |
| E1335.0 | request.max-message-length                                                                                                                    |
| E1335   | Message length is too long. Maximum message length for advertisement messages is {0}.                                                         |
| E1336   | No matching service code found for the charging amount                                                                                        |
| E1337   | Subscriber authentication by charging gateway failed.                                                                                         |
| E1351   | User already registered                                                                                                                       |
| E1356   | User not registered                                                                                                                           |
| E1357   | Sorry, you are unauthorised to use the {0} application.                                                                                       |
| E1360   | Error response from SDP-SBL                                                                                                                   |
| E1361   | Message rejected by SDP-SBL                                                                                                                   |
| E1362   | Invalid request                                                                                                                               |
| E1363   | No response/response delayed from SDP-SBL                                                                                                     |
| E1364   | Could not send the message to SDP-SBL                                                                                                         |
| E1365   | Subscriber is not registered to use this application                                                                                          |
| E1366   | Mt Delivery failed                                                                                                                            |
| E1367   | Request QOS not supported                                                                                                                     |
| E1368   | Requested ServiceType not supported                                                                                                           |
| E1370   | Invalid reservation Id.                                                                                                                       |
| E1371   | App do not accept payments from given Payment Instrument                                                                                      |
| E1372   | Default payment instrument for the user not found.                                                                                            |
| E1373   | Invalid payer account.                                                                                                                        |
| E1374   | Invalid payee account.                                                                                                                        |
| E1375   | Transfer between two different payment instruments is not allowed.                                                                            |
| E1376   | Unknown charging error.                                                                                                                       |
| E1377   | Invalid payment instrument name.                                                                                                              |
| E1378   | Insufficient balance.                                                                                                                         |
| E1379   | Transaction has already completed.                                                                                                            |
| E1380   | Transaction currency not supported.                                                                                                           |
| E1381   | IP address, which the request originates from is not allowed access this service.                                                             |
| E1382   | Payment Instrument is not allowed perform transactions.                                                                                       |
| E1383   | USSD network initiated flow not allowed.                                                                                                      |
| E1384   | International SMS sending is disabled.                                                                                                        |
| E1387   | NCS SLA configured Merchant ID not found in DB.                                                                                               |
| E1400   | Card Management Module Unavailable                                                                                                            |
| E1401   | Invalid NFC Token                                                                                                                             |
| E1402   | NFC Token do not match with request                                                                                                           |
| E1404   | Charging Failed.                                                                                                                              |
| E1405   | Charging Authorization Timeouted.                                                                                                             |
| E1406   | Charging Authorization Rejected.                                                                                                              |
| E1603   | Temporary System Error occurred while delivering your request.                                                                                |
| E1600   | Sorry, the {0} application is temporarily  unavailable. Please try again later.                                                               |
| E1601   | An unexpected error has occurred                                                                                                              |
| E1605   | Invalid charging request                                                                                                                      |
| E1606   | Invalid charging amount                                                                                                                       |
| E1602   | Message delivery failed                                                                                                                       |
| E1825   | Unsupported operation                                                                                                                         |
| E1337   | Subscriber authentication by charging gateway failed.                                                                                         |
| E1830   | This service is not available for {0} users.                                                                                                  |