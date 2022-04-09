from pydub import AudioSegment
import os

timeStamps = [
    [], #Leave here for proper indexing
    [], #C1
    [], #C2
    [], #C3
    [], #C4 - incorrect format
    [], #C5 - Unfinished audio?
    [], #C6
    [], #C7
    [], #C8
    [], #C9
    [], #C10
    [], #C11 - Unfinished audio?
    [], #C12
    [], #C13
    [], #C14
    [[0, 40], [40, 88], [88, 136.5], [136.5, 172.5], [173, 207.5], [207.5, 245.5], [245.75, 276], [276.5, 308], [308.5, 346.5], [347, 389.5], [389.5, 436], [436.5, 487], [487.5, 497]], #C15
    [[0, 33], [33, 77], [77.5, 122], [122, 184.25], [184.5, 220], [220, 266], [266, 313.5], [314, 355.5], [355.75, 402]], #C16
    [[0, 40], [40, 78], [78.5, 106], [106, 157.5], [157.75, 197.5], [198, 222], [222.5, 257], [257, 294.5], [294.75, 326.5], [326.75, 364], [364, 408]], #C17
    [[0, 32], [32.5, 77.5], [78, 114.5], [115, 150.5], [151, 189.5], [190, 227.5], [228.25, 281.5], [281.75, 324.5], [325, 353]], #C18
    [], #C19
    [], #C20
    [] #C21
]

#Need the line below because some chapters may be missing pages/audio so after each chapter, reset the starting page number
chapterStartPageNumber = [0, 1, 7, 24, 34, 46, 58, 69, 84, 93, 102, 114, 125, 142, 150, 159, 172, 181, 192, 209, 222, 233, 240]

def splitChapterAudioToPages():
    prefixPath = os.getcwd()
    newPath = os.path.abspath(os.path.join(prefixPath, os.pardir))
    chapterAudioDirectory = os.path.join(newPath, "Audio/ChapterAudio")
    files = os.listdir(chapterAudioDirectory)

    for chapterNumber in range(1, 22):
        chapterAudioFile = "dd_" + str(chapterNumber) + ".mp3"
        pageNumber = chapterStartPageNumber[chapterNumber]
        if chapterAudioFile in files:
            chapterAudio = AudioSegment.from_mp3(chapterAudioDirectory + "/" + chapterAudioFile)
            pageTimeStamps = timeStamps[chapterNumber]
            for i in range(len(pageTimeStamps)):
                start = pageTimeStamps[i][0] * 1000 # Works in milliseconds
                end = pageTimeStamps[i][1] * 1000
                newAudio = chapterAudio[start:end]
                filePath = chapterAudioDirectory + "/C" + str(chapterNumber) + "/Chapter"+ str(chapterNumber) + "_Page" + str(pageNumber) + ".mp3"

                newAudio.export(filePath, format="mp3") #Exports file to specified file path
                pageNumber += 1

def main():
    splitChapterAudioToPages()

if __name__ == '__main__':
    main()