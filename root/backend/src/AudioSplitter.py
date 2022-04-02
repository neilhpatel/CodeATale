from pydub import AudioSegment
import os

timeStamps = [
    [], #Leave here for proper indexing
    [3, 46, 110, 167, 207, 244, 270], #C1
    [0, 40, 85, 137, 179, 214, 248, 291, 337, 390, 439, 474, 514, 563, 625, 656, 708, 767],#C2
    [0, 44, 96, 139, 195, 227, 275, 327, 378, 413, 449], #C3
    [], #C4 - incorrect format
    [0, 36.5, 72, 113, 150, 189, 223, 262, 305, 338.5, 369], #C5 - Unfinished audio?
    [0, 48.5, 89, 128, 162, 213, 254, 287, 321, 363, 395.5, 434], #C6
    [0, 43, 93.5, 129, 175, 226, 281, 318.5, 355, 387, 414.5, 440, 474, 505, 544, 550], #C7
    [0, 58, 90, 146, 190, 228, 278, 326, 387.5, 430], #C8
    [0, 31.5, 66, 98.5, 131.5, 170, 202, 234, 262.5, 280], #C9
    [0, 59, 98, 131.5, 162.25, 193, 225, 268, 315, 362, 405, 452, 492], #C10
    [0, 38, 78, 118, 165, 209, 249, 284], #C11 - Unfinished audio?
    [0, 39, 74, 120, 175, 218, 264, 296, 335, 369, 415, 466, 505, 543, 576, 631, 678, 707], #C12
    [0, 50, 71, 128, 180, 218, 265, 308, 339], #C13
    [0, 34, 67, 96, 135, 180, 214, 253, 295, 327], #C14
    [0, 40, 88, 136, 172, 207, 245, 276, 308, 346, 389, 436, 486, 496], #C15
    [0, 32, 77, 121, 183, 219, 265, 313, 355, 402], #C16
    [0, 39, 78, 105, 157, 197, 222, 256, 294, 326, 363, 408], #C17
    [0, 32, 77, 114, 150, 189, 227, 281, 324, 353, 389, 428, 466, 512, 582, 636, 674, 678], #C18
    [0, 34, 74, 120, 153, 198, 227, 264, 307, 342, 386, 428, 470, 492], #C19
    [0, 39, 67, 114, 148, 186, 222, 268, 297, 332, 372, 406], #C20
    [0, 48, 88, 133, 177, 214, 253, 273] #C21

]

#Need the line below because some chapters may be missing pages/audio so after each chapter, reset the starting page number
chapterStartPageNumber = [0, 1, 7, 24, 34, 46, 58, 69, 84, 93, 102, 114, 125, 142, 150, 159, 172, 181, 192, 209, 222, 233, 240]

def splitChapterAudioToPages():
    prefixPath = os.getcwd()
    newPath = os.path.abspath(os.path.join(prefixPath, os.pardir))
    chapterAudioDirectory = os.path.join(newPath, "Audio/ChapterAudio")
    files = os.listdir(chapterAudioDirectory)
    if '.DS_Store' in files:
        files.remove('.DS_Store')

    for chapterNumber in range(1, 22):
        chapterAudioFile = "dd_" + str(chapterNumber) + ".mp3"
        pageNumber = chapterStartPageNumber[chapterNumber]
        if chapterAudioFile in files:
            chapterAudio = AudioSegment.from_mp3(chapterAudioDirectory + "/" + chapterAudioFile)
            pageTimeStamps = timeStamps[chapterNumber]
            for i in range(len(pageTimeStamps) - 1):
                start = pageTimeStamps[i] * 1000  # Works in milliseconds
                end = pageTimeStamps[i + 1] * 1000

                newAudio = chapterAudio[start:end]
                filePath = chapterAudioDirectory + "/C" + str(chapterNumber) + "/Chapter"+ str(chapterNumber) + "_Page" + str(pageNumber) + ".mp3"

                newAudio.export(filePath, format="mp3") #Exports file to specified file path
                pageNumber += 1

def main():
    splitChapterAudioToPages()

if __name__ == '__main__':
    main()
