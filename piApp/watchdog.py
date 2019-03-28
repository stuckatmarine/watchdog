import argparse
import requests
import datetime as dt
import time
import picamera
import json
import yaml
import base64
from dateutil import parser

import detect

ap = argparse.ArgumentParser()
ap.add_argument("-n", "--mpuid", type=int, default=123, help="mpuID number, integer")
ap.add_argument("-c", "--config", type=str, default="conf_json.json", help="name of config file relative to working dir")
ap.add_argument("-i", "--interval", type=float, default=1, help="interval in minutes to take photographs for object detection")
ap.add_argument("-s", "--start", type=str, default=None, help="time to begin tracking (e.g. '10:00 AM')")
ap.add_argument("-e", "--end", type=str, default=None, help="time to end tracking (e.g. '9:00 PM')")
ap.add_argument("-d", "--dir", type=str, default="logs/", help="directory to store log of objects")
ap.add_argument("--vflip", action="store_true", help="flip images taken from camera vertically")
ap.add_argument("--hflip", action="store_true", help="flip images taken from camera horizontally")

args = vars(ap.parse_args())

dotCom = "http://192.168.43.7:5000"
TEMP_FILE_NAME = "temp.jpg"
TIME_FORMAT = "%Y.%m.%d_%H.%M.%S"
TIME_FORMATP = "%Y-%m-%d_%H:%M:%S"
PIC_DIRECTORY = "pics/"
REQUEST_TIMEOUT = 10

def setup_camera(vflip, hflip):
    camera = picamera.PiCamera()
    camera.vflip = vflip
    camera.hflip = hflip
    return camera

# send image and metadata as http post request to srver
def sendImage(imgName, objects = "testImg"):
    #openFile = open(imgName, 'rb')
    print ("Sending " + imgName + " notification")
    try:
        with open(imgName, 'rb') as img:
            url = dotCom + "/mpu/trigger/" + str(args["mpuid"])
            
            # endcode image to string file for transmission, to be decoded later
            imgStr = base64.b64encode(img.read())

            try:
                response = requests.post(url, data=imgStr, headers={"metadata":json.dumps(objects)}, timeout=REQUEST_TIMEOUT)
                print("Post response code : " + str(response.status_code))
            except requests.exceptions.RequestException as e:
                print(e)
    except EnvironmentError as e:
        print(e)
        
# primary function for tracking dog/ other objects
def track(camera, interval, start_time, end_time, directory, confJson):
    print(interval)
    next_picture_time = dt.datetime.now() + dt.timedelta(minutes=float(interval))
    dtn = dt.datetime.now()
    pic_name = '{}/{}.jpg'.format(PIC_DIRECTORY, dtn.strftime(TIME_FORMATP))
    camera.capture(TEMP_FILE_NAME)
    objects = detect.detect_from_image(TEMP_FILE_NAME, pic_name, confJson)
    file_name = '{}/{}.json'.format(directory, dtn.strftime(TIME_FORMAT))

    with open(file_name, 'w') as fp:
        json.dump(objects, fp)
        fp.close()
        
    # if pic match filters
    sendB = False
    for cls in confJson["classNames"]:
        if cls in objects:
            sendB = True
            break
    if sendB == True:
        sendImage('{}{}.jpg'.format(PIC_DIRECTORY, dtn.strftime(TIME_FORMATP)), objects)

    print("Next picture will be taken at {}".format(next_picture_time.strftime(TIME_FORMAT)))    
    seconds_to_sleep = (next_picture_time - dt.datetime.now() ).total_seconds()
    seconds_to_sleep = max(0, seconds_to_sleep)
    return seconds_to_sleep

# needed for parsing json in python 2.7, removes 'u' unix added char
def byteify(input):
    if isinstance(input, dict):
        return {byteify(key): byteify(value)
                for key, value in input.iteritems()}
    elif isinstance(input, list):
        return [byteify(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

        
if __name__ == "__main__":
    
    # get up to date config file from server, else use local one
    print("Requesting to configuration info from server")
    remote = False
    try:
        r = requests.get(dotCom + "/mpu/prefrences/" + str(args["mpuid"]), timeout=REQUEST_TIMEOUT)
        print("Request response code : " + str(r.status_code))
        if r.status_code == 200:
            confJson = r.json()
            remote = True
    except requests.exceptions.RequestException as e:
        print(e)
    
    if not remote:
        print("Config from server no good, using local file")
        confJson = byteify(json.load(open(args["config"])))	

    # server test
    #print("Sending last img as server test")
    #sendImage(TEMP_FILE_NAME)

    # create camera instance
    print("Warming up camera")
    camera = setup_camera(confJson["vFlip"], confJson["hFlip"])

    # confirm operational times for WatchDog to operate
    if confJson["startTime"] == "None":
        start_time = dt.datetime.now()
    else:
        start_time = parser.parse(confJson['startTime'])
    
    if confJson["endTime"] == "None":
        end_time = dt.datetime.max
    else:
        end_time = parser.parse(confJson["end"])
        if end_time < start_time:
            end_time + dt.timedelta(days=1)
    print("StartTime  {}".format(start_time))
    print("EndTime    {}".format(end_time))
    
    # build yolo model from weights, only done once per run
    print("Building yolo model from source (~30s)")
    detect.load_yolo_model(confJson["tiny"])
    
    # sleep if outside operational time window
    if start_time > dt.datetime.now():
        sleep_seconds = (start_time - dt.datetime.now()).seconds
        print("Currently outside running timeframe. Sleep until : ", start_time.strftime(TIME_FORMAT))
        time.sleep(sleep_seconds)

    print("---------  Starting watchdog  ---------")
    
    if end_time is not None:
        print("Running until {}".format(end_time.strftime(TIME_FORMAT)))
        
    # take snapshot and track objects based on confJson
    while dt.datetime.now() < end_time:
        nextPicDelay = track(camera=camera, interval=confJson["interval"], start_time=start_time, end_time=end_time, directory=args["dir"], confJson=confJson)
        time.sleep(nextPicDelay)
