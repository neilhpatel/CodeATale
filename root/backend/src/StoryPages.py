import docx2txt
import os


class StoryPages:
    pageDictionary = {}
    text = []
    AVERAGE_CHARACTERS_PER_PAGE = 700 #Based on the frontend UI, 700 seems to be a good amount to leave
    # space for an audio scrollbar but this can be changed later on depending on our needs.

    def __init__(self, filePath):
        self.filePath = filePath
        self.text = docx2txt.process(self.filePath)
        
    #Method that parses the story into pages that can be accessed by a page number using self.pageDictionary
    def parseStoryIntoPages(self):
        pageText = ['']
        characterCountForPage = 0
        pageNumber = 0
        wordIndex = 0
        totalCharacterCount = 0
        while totalCharacterCount < len(self.text):
            letter = self.text[totalCharacterCount]
            #letter is part of an existing word so append it to that word
            if letter != ' ':
                pageText[wordIndex] = pageText[wordIndex] + letter
            #letter is a space character so begin a new word
            elif letter == ' ':
                pageText.append('')
                wordIndex += 1

            characterCountForPage += 1
            totalCharacterCount += 1
            if (characterCountForPage >= self.AVERAGE_CHARACTERS_PER_PAGE):
                #Always end at a space delimeter. This while loop prevents words from being cut off mid-word.
                while (self.text[totalCharacterCount] != ' '):
                    letter = self.text[totalCharacterCount]
                    pageText[wordIndex] = pageText[wordIndex] + letter
                    totalCharacterCount += 1
                totalCharacterCount += 1
                self.pageDictionary[pageNumber] = pageText
                characterCountForPage = 0
                pageNumber += 1
                wordIndex = 0
                pageText = ['']

        #Edge case for last page. Without this check, the last page will never be included since the code will exit out
        #of the outer while loop before adding the final page.
        if len(pageText) != 0:
            self.pageDictionary[pageNumber] = pageText
        print("Number of pages: ", len(self.pageDictionary))


def main():
    prefixPath = os.getcwd()
    newPath = os.path.abspath(os.path.join(prefixPath, os.pardir))
    docPath = os.path.join(newPath, "docs")
    storyFilePath = os.path.join(docPath, "DrDolittle.docx")
    storyPages = StoryPages(storyFilePath)
    storyPages.parseStoryIntoPages()


if __name__ == '__main__':
    main()