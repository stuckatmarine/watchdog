## Fetch the latest user prefrences
---
URL: `https://example.com/user/prefrences/:mpu_id` </br>
Method: `GET` </br>
URL Param: `mpu_id=[integer]` </br>
Data Params: `None` </br>
Success Code: `200` </br>
Success Content: 
```json 
{
    "prefrences": [{"dog": 1, "cat": 1}, 
                   {"dog": 2, "cat": 1}]
}
```
Error Code: `404` </br> 
Error Content: `{ "error" : "MPU invalid" }` </br>


## Create a User
---
URL: `https://example.com/user/` </br>
Method: `POST` </br>
URL Param: `None` </br>
Data Params: 
```json
{
    "username": "sample_user",
    "password_sha256": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    "email": "sample@test.ca",
    "phone_num": 15417543010
}
```
Success Code: `200` </br>
Success Content: `{ "status": "OK" }` </br>
Error Code: `404` </br>
Error Content: `{ "error" : "username already exists" }` </br>
 

## Update a Users Prefrences
---
URL: `https://example.com/user/prefrences/:username` </br>
Method: `PUT` </br>
URL Param: `username=[string]` </br>
Data Params:
```json
{
    "contact_sms": false,
    "contact_app": true,
    "contact_web": false,
    "contact_email": false
}
```
Success Code: `200` </br>
Success Content: `{ "status": "OK" }` </br>
Error Code: `404` </br>
Error Content: `{ "error" : "username does not exist" }` </br>


## Add MPU to a User
---
URL: `https://example.com/user/mpu/:username`</br>
Method: `PUT` </br>
URL Param: `username=[string]` </br>
Data Params:
```json
{
    "mpu_id": [38748937489237]
}
```
Success Code: `200` </br>
Success Content: `{ "status": "OK" }` </br>
Error Code: `404` </br>
Error Content: `{ "error" : "username does not exist" }` </br>


## Delete a User
---
URL: `https://example.com/user/:username` </br>
Method: `DELETE` </br>
URL Param: `username=[string]` </br>
Data Params: `None` </br>
Success Code: `200` </br>
Success Content: `{ "status": "OK" }` </br>
Error Code: `404` </br>
Error Content: `{ "error" : "username does not exist" }` </br>


## MPU Notification Trigger
---
URL: `https://example.com/user/trigger/:mpu_id` </br>
Method: `POST` </br>
URL Param: `mpu_id=[integer]` </br>
Data Params:
```json 
{
    "photo": 231321023829083,
    "metadata": [{"dog": 70.232}, {"cat": 94.33}]
}
```
Success Code: `200` </br>
Success Content: `{ "status": "OK" }` </br>
Error Code: `404` </br>
Error Content: `{ "error" : "MPU invalid" }` </br>
