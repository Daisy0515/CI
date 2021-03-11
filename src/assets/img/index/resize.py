import cv2

def compress(path):
    pic = cv2.imread(path)
    print(pic.shape)
    #pic = cv2.resize(pic, (pic.shape[1]*3//4, pic.shape[0]*3//4), interpolation=cv2.INTER_CUBIC)
    #pic = pic[:,300:,:]
    #cv2.imwrite(path[:-4]+"1.png", pic)
    cv2.imwrite(path[:-4]+".jpg",pic,[int(cv2.IMWRITE_JPEG_QUALITY),70])


compress('./about_background.png')