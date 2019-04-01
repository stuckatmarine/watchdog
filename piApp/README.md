## Quick Start

### Pre
Get python2.7 [here](https://www.python.org/download/releases/2.7/) (not python 3!, Tensorflow is not compatable on pi for 3+) 

### Setup
Download the weights (to large for git)
```shell
$ download_weights.sh
```

Get dependencies if you don't have them already
```shell
$ pip install keras picamera numpy tensorflow
```

### Run it

Run the main program
```shell
$ python watchdog.py
```

**To use autostart script** 
- Update watchdogAutostart.sh with the location of your virtual env to activate if one is used
- Edit your "/etc/xdg/lxsession/LXDE/autostart.txt" with "@/pathtomyscript/watchdogAutostart.sh" to run on startup

## Sample post yolo image
![Sample Post Yolo image with Dog](pics/sampleDog.jpg)

## Features
* Auto launch watchdog on startup with shell script: watchdogAutostart.sh
* Get config file from server, else use local file: conf_json.json
* Load either yolov2 or yolov2 tiny model via conf_json tiny value: model_configs.py or model_tiny_configs.py
* Take image based on time interval: /pics/sampleDog.jpg
* Send notification to server if a specific class is identified in the image: 200 is the sucessfull response code.

### Built With

* [YOLOv2](https://pjreddie.com/darknet/yolo/) - Object detection
* [TensorFlow](https://www.tensorflow.org/) - Machine Learning
* [Keras](https://keras.io/) - TensorFlow API
* [Pi Camera](https://picamera.readthedocs.io/en/release-1.13/) - Pi Camera operation
* [Numpy](http://www.numpy.org/) - Math for all the things

Boilerplate from breeko/spypy
