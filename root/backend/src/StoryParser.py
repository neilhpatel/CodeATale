import docx2txt
import os
import json


class StoryPages:
    pageDictionary = {}
    text = []
    # Based on the frontend UI, 700 seems to be a good amount to leave
    AVERAGE_CHARACTERS_PER_PAGE = 700
    # space for an audio scrollbar but this can be changed later on depending on our needs.

    def __init__(self, filePath):
        self.filePath = filePath
        self.text = docx2txt.process(self.filePath)

    # Method that parses the story into pages that can be accessed by a page number using self.pageDictionary
    def parseStoryIntoPages(self):
        pageText = ['']
        characterCountForPage = 0
        pageNumber = 0
        wordIndex = 0
        totalCharacterCount = 0
        paragraphCount = 0
        chapterNumber = 0
        while totalCharacterCount < len(self.text):
            letter = self.text[totalCharacterCount]
            # letter is part of an existing word so append it to that word
            if letter != ' ':
                pageText[wordIndex] = pageText[wordIndex] + letter
            # letter is a space character so begin a new word
            elif letter == ' ':
                pageText.append('')
                wordIndex += 1
            # Paragraphs always have '\n\n' so when this appears, increment the paragraph count. If this occurs, the
            # current iteration of the while loop has just ended at a paragraph, so the value of paragraphCount can be
            # immediately checked below.
            if letter == '\n' and self.text[totalCharacterCount-1] == '\n':
                paragraphCount += 1

            # Regardless of the letter, increment the character count for the page and the total character count.
            characterCountForPage += 1
            totalCharacterCount += 1

            # If the word is "CHAPTER", stop parsing and add the remaining text on the page to the current chapter. Reset
            # all variables to default values to begin parsing new chapter and page.
            if pageText[wordIndex] == 'CHAPTER':
                chapterNumber += 1
                if chapterNumber not in self.pageDictionary.keys():
                    self.pageDictionary[chapterNumber] = {}
                self.pageDictionary[chapterNumber][pageNumber] = pageText #Copy remaining text on page to current chapter
                characterCountForPage = 0
                wordIndex = 0
                pageText = ['']
                pageNumber += 1
                paragraphCount = 0

            # If paragraph count is at least 3, stop parsing the page and add the page text to the dictionary and reset
            # variables to begin next page.
            if (paragraphCount >= 3):
                self.pageDictionary[chapterNumber][pageNumber] = pageText
                characterCountForPage = 0
                pageNumber += 1
                wordIndex = 0
                pageText = ['']
                paragraphCount = 0


        #Remaining text for the last page will be excluded since the while loop terminates at the end without adding
        #the last pages text. Append that text to the existing last page.
        lastPageText = self.pageDictionary[chapterNumber][pageNumber - 1]
        lastPageText += pageText
        self.pageDictionary[chapterNumber][pageNumber - 1] = lastPageText


def main():
    prefixPath = os.getcwd()
    newPath = os.path.abspath(os.path.join(prefixPath, os.pardir))
    docPath = os.path.join(newPath, "docs")
    storyFilePath = os.path.join(docPath, "DrDolittle.docx")
    storyPages = StoryPages(storyFilePath)
    storyPages.parseStoryIntoPages()

    with open("parsedPages.json", "w") as outfile:
        json.dump(storyPages.pageDictionary, outfile)


if __name__ == '__main__':
    main()
