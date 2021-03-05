import cv2

def compress(path):
    new_path = path[:-8] + ".jpg"
    pic = cv2.imread(path)
    pic = cv2.resize(pic, (160, 160), interpolation=cv2.INTER_CUBIC)
    cv2.imwrite(new_path, pic)

import os

def findAllFile(base):
    for root, ds, fs in os.walk(base):
        for f in fs:
            if f.endswith('.jpg'):
                fullname = os.path.join(root, f)
                yield fullname

def main():
    base = './'
    for i in findAllFile(base):
        print(i)
        compress(i)

if __name__ == '__main__':
    main()