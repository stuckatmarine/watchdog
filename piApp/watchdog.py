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

dotCom = "http://192.168.137.135:5000"
TEMP_FILE_NAME = "temp.jpg"
TIME_FORMAT = "%Y.%m.%d_%H.%M.%S"
TIME_FORMATP = "%Y-%m-%d_%H:%M:%S"
PIC_DIRECTORY = "pics/"

def setup_camera(vflip, hflip):
    camera = picamera.PiCamera()
    camera.vflip = vflip
    camera.hflip = hflip
    return camera

def sendImage(imgName):
    openFile = open(imgName, 'rb')
    headers = {"metadata":[imgName]}
    with open(imgName, 'rb') as img:
        files = {"image": (imgName,img,'imgNameConfirmation',{'Expires': '0'})}
        url = dotCom + "/mpu/trigger/" + str(args["mpuid"])
        print ("sending " + imgName + " notification")
        imgStr = base64.b64encode(img.read())
        print ("imgStr" + imgStr[:10])
        response = requests.post(url, data=imgStr)
        '''with requests.Session() as s:
            r = s.post(url,files=files)
        '''
        print(response.status_code)
        
def track(camera, interval, start_time, end_time, directory, confJson):
    print(interval)
    next_picture_time = dt.datetime.now() + dt.timedelta(minutes=float(interval))
    dtn = dt.datetime.now()
    pic_name = '{}/{}.jpg'.format(PIC_DIRECTORY, dtn.strftime(TIME_FORMATP))
    camera.capture(TEMP_FILE_NAME)
    objects = detect.detect_from_image(TEMP_FILE_NAME, pic_name)
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
        sendImage('{}{}.jpg'.format(PIC_DIRECTORY, dtn.strftime(TIME_FORMATP)))

    print("Next picture will be taken at {}".format(next_picture_time.strftime(TIME_FORMAT)))    
    seconds_to_sleep = (next_picture_time - dtn).total_seconds()
    seconds_to_sleep = max(0, seconds_to_sleep)
    return seconds_to_sleep

# needed for parsing json in python 2.7, removes 'u' char
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
    print("get configuration info from server")
    r = requests.get(dotCom + "/mpu/prefrences/" + str(args["mpuid"]))
    if r.status_code == 200:
        
        confJson = r.json()
    else:
        print(r.status_code)
        print(r.text)
        print("config from server no good, using local file")
        confJson = byteify(json.load(open(args["config"])))	
        print(confJson['startTime'])
    
    #confJson = byteify(json.load(open(args["config"])))	
    
    print("sending test image")
    sendImage("temp.jpg")

    # create camera instance
    print("warming up camera")
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
    print("StartTime {} -> EndTime {}", start_time, end_time)
    
    # build yolo model from weights, only done once per fun
    print("Building model ~1.5mins")
    detect.load_yolo_model()
    
    # sleep if outside operational time window
    print("Starting watchdog...")
    if start_time > dt.datetime.now():
        sleep_seconds = (start_time - dt.datetime.now()).seconds
        print("Sleep until : ", start_time.strftime(TIME_FORMAT))
        time.sleep(sleep_seconds)

    # if operational, print how long WatchDog will run from now in sec's
    if end_time is not None:
        print("Running until {}".format(end_time.strftime(TIME_FORMAT)))
    else:
        end_time = dt.datetime.max
    
    # take snapshot and track objects based on confJson
    while dt.datetime.now() < end_time:
        sleepTime = track(camera=camera, interval=confJson["interval"], start_time=start_time, end_time=end_time, directory=args["dir"], confJson=confJson)
        time.sleep(sleepTime)
