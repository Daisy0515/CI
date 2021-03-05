import cv2

def compress(path):
    new_path = path[:-4] + "_min.jpg"
    pic = cv2.imread(path)
    print(pic.shape)
    pic = cv2.resize(pic, (pic.shape[1], pic.shape[0]), interpolation=cv2.INTER_CUBIC)
    cv2.imwrite(new_path, pic)

compress('./index_background.png')