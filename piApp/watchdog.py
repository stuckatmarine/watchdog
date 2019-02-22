import argparse
import requests
import datetime as dt
import time
import picamera
import json
import yaml
from dateutil import parser

import detect

ap = argparse.ArgumentParser()
ap.add_argument("-n", "--mpuid", type=int, default=12345, help="mpuID number, integer")
ap.add_argument("-c", "--config", type=str, default="conf_json.json", help="name of config file relative to working dir")
ap.add_argument("-i", "--interval", type=float, default=1, help="interval in minutes to take photographs for object detection")
ap.add_argument("-s", "--start", type=str, default=None, help="time to begin tracking (e.g. '10:00 AM')")
ap.add_argument("-e", "--end", type=str, default=None, help="time to end tracking (e.g. '9:00 PM')")
ap.add_argument("-d", "--dir", type=str, default="logs/", help="directory to store log of objects")
ap.add_argument("--vflip", action="store_true", help="flip images taken from camera vertically")
ap.add_argument("--hflip", action="store_true", help="flip images taken from camera horizontally")

args = vars(ap.parse_args())

TEMP_FILE_NAME = "temp.jpg"
TIME_FORMAT = "%Y.%m.%d_%H.%M.%S"
PIC_DIRECTORY = "pics/"

def setup_camera(vflip, hflip):
    camera = picamera.PiCamera()
    camera.vflip = args["vflip"]
    camera.hflip = args["hflip"]
    return camera
    
def track(camera, interval, start_time, end_time, directory):
    next_picture_time = dt.datetime.now() + dt.timedelta(minutes=interval)
    pic_name = '{}/{}.jpg'.format(PIC_DIRECTORY, dt.datetime.now().strftime(TIME_FORMAT))
    camera.capture(TEMP_FILE_NAME)
    objects = detect.detect_from_image(TEMP_FILE_NAME)
    file_name = '{}/{}.json'.format(directory, dt.datetime.now().strftime(TIME_FORMAT))

    with open(file_name, 'w') as fp:
        json.dump(objects, fp)

    print("Next picture will be taken at {}".format(next_picture_time.strftime(TIME_FORMAT)))
    
    seconds_to_sleep = (next_picture_time - dt.datetime.now()).total_seconds()
    seconds_to_sleep = max(0, seconds_to_sleep)
    return seconds_to_sleep

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
	
    print("get configuration info from server")
    r = requests.get("https://example.com/user/preferences/:" + str(args["mpuid"]))
    if r.status_code == 200:
        confJson = json.load(r.json())
    else:
        print("config from server no good, using local file")
        confJson = byteify(json.load(open(args["config"])))	
        print(confJson['startTime'])
	
    print("warming up camera")
    camera = setup_camera(confJson["vFlip"], confJson["hFlip"])
	
	
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
    
    print("Building model ~1.5mins")
    detect.load_yolo_model()
    
    print("Starting watchdog...")
    if start_time > dt.datetime.now():
        sleep_seconds = (start_time - dt.datetime.now()).seconds
        print("Sleep until : ", start_time.strftime(TIME_FORMAT))
        time.sleep(sleep_seconds)

    if end_time is not None:
        print("Running until {}".format(end_time.strftime(TIME_FORMAT)))
    else:
        end_time = dt.datetime.max
       
    while dt.datetime.now() < end_time:
        sleepTime = track(camera=camera, interval=confJson["interval"], start_time=start_time, end_time=end_time, directory=args["dir"])
        time.sleep(sleepTime)
