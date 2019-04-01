## Watchdog

### Problem
Frank has a dog. <br/>
Frank’s dog enjoys being outside for extended periods of time. <br/>
Frank’s dog likes to go outside immediately when the upstairs tenants' dogs are outside and come in when they are not.<br/>
Frank’s dog also likes to dig and perform other undesirable behaviours when it is bored or would like to come inside.<br/>
Frank is often busy and can not monitor his dog 24/7.<br/>
Don’t be like Frank. <br/>

Noah has a dog.<br/>
Noah also has a Watchdog.<br/>
Noah is notified if his dog digs or would like to be let inside/outside.<br/>
Noah can focus on his studies and not worry about his dog.<br/>
Be like Noah.<br/>


### Solution
The Watchdog (pi) requests a config file from the flask server, if response fails it uses a local file.<br/>
It will then take pictures every 'intervalTime' seconds, and check the image for specific objects chosen by the user, using yolov2 or yolov2-tiny.<br/>
If a desired object is found the image and yolo log data are sent to the server, stored in a mongoDB (database) and send to the user (SMS/Email/Web-App).<br/>
The user configuration can be changed in real time on the web-app or locally on the Watchdog.<br/>


## Getting Started

Each sub folder has a respective portion of the stack and instructions on how to get it up and running on your local machine for development and testing purposes. The Watchdog database just base [MongoDB](https://www.mongodb.com/), so no there is no need to store related files here as it is hosted on Google Cloud (Flask will auto connect to this so internet is required).
```
.
├── /flaskApp/       # Backend Flask app
├── /piApp/          # Rasberry Pi object detection
├── /webApp/         # Isomorphic web app
```

## Architecture

### Stack Diagram
![Watchdog Stack Diagram](/overview.PNG)

### Sample Use Case
![Watchdog Use Case Diagram](/projectArchitecture.png)

## Task List
![Watchdog Sketch and Task List](/initialSketchAndTasks.jpg)

### First Iteration - Minimum Viable Product
- [x] object recognition on raspberry pi
- [x] server to communicate with pi/user/database
- [x] web app for server/database configuration
- [X] Specifiy parameters for user to be notified about
- [X] Notify user via email/sms

### Second Iteration
- [X] Optomize object recognition w tiny weights

### Third Iteration
- [ ] Android application user interface for configuration/notifications
- [ ] Train dog-digging data and add to classes

## Authors

|[<img src="https://avatars1.githubusercontent.com/u/33398082?s=460&v=4" width="128">](https://github.com/andrewnash)|[<img src="https://avatars1.githubusercontent.com/u/19956131?s=460&v=4" width="128">](https://github.com/stuckatmarine)
|:---:|:---:|
|[Andrew Nash](https://github.com/andrewnash)| [Mark Duffett](https://github.com/stuckatmarine)
|<sup>Web App & Backend</sup>|<sup>Raspberry Pi Object Detection</sup>

## License
Licensed under SPDX standard [BSD-4-clause](https://github.com/stuckatmarine/watchdog/blob/master/LICENSE.md) 
