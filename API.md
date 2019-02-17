## Fetch the latest user prefrences
---
URL: `https://example.com/user/prefrences/:mpu_id`
Method: `GET`
URL Param: `mpu_id=[integer]`
Data Params: `None`
Success Code: `200`
Success Content: 
```json 
{
    "prefrences": [{"dog": 1, "cat": 1}, 
                   {"dog": 2, "cat": 1}]
}
```
Error Code: `404`
Error Content: `{ "error" : "MPU invalid" }`


## Create a User
---
URL: `https://example.com/user/`
Method: `POST`
URL Param: `None`
Data Params:
```json
{
    "username": "sample_user",
    "password_sha256": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    "email": "sample@test.ca",
    "phone_num": 15417543010
}
```
Success Code: `200`
Success Content: `{ "status": "OK" }`
Error Code: `404`
Error Content: `{ "error" : "username already exists" }`


## Update a Users Prefrences
---
URL: `https://example.com/user/prefrences/:username`
Method: `PUT`
URL Param: `username=[string]`
Data Params:
```json
{
    "contact_sms": false,
    "contact_app": true,
    "contact_web": false,
    "contact_email": false
}
```
Success Code: `200`
Success Content: `{ "status": "OK" }`
Error Code: `404`
Error Content: `{ "error" : "username does not exist" }`


## Add MPU to a User
---
URL: `https://example.com/user/mpu/:username`
Method: `PUT`
URL Param: `username=[string]`
Data Params:
```json
{
    "mpu_id": [38748937489237]
}
```
Success Code: `200`
Success Content: `{ "status": "OK" }`
Error Code: `404`
Error Content: `{ "error" : "username does not exist" }`


## Delete a User
---
URL: `https://example.com/user/:username`
Method: `DELETE`
URL Param: `username=[string]`
Data Params: `None`
Success Code: `200`
Success Content: `{ "status": "OK" }`
Error Code: `404`
Error Content: `{ "error" : "username does not exist" }`


## MPU Notification Trigger
---
URL: `https://example.com/user/trigger/:mpu_id`
Method: `POST`
URL Param: `mpu_id=[integer]`
Data Params:
```json 
{
    "photo": 231321023829083,
    "metadata": [{"dog": 70.232}, {"cat": 94.33}]
}
```
Success Code: `200`
Success Content: `{ "status": "OK" }`
Error Code: `404`
Error Content: `{ "error" : "MPU invalid" }`
