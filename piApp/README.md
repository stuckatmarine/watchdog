## Installation

### Pre
Get python2.7 [here](https://www.python.org/download/releases/2.7/) (not python 3!, Tensorflow is not compatable on pi for 3+) 

### Setup
Download the weights (to large for git)
```shell
$ download_weights.sh
```

Get dependencies if you don't have them already
```shell
$ pip install keras picamera numpy
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

## Built With

* [YOLOv2](https://pjreddie.com/darknet/yolo/) - Object detection
* [Keras](https://keras.io/) - Machine Learning for object detection
* [Pi Camera](https://picamera.readthedocs.io/en/release-1.13/) - Pi Camera operation
* [Numpy](http://www.numpy.org/) - Math for all the things

Boilerplate from breeko/spypy
