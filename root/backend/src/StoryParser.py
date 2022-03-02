import docx2txt
import os
import json


# Method that returns a boolean on whether enough paragraphs and enough text is on the screen to constitute a page.
# Alter values to finetune how much is on a page. In general, each paragraph takes up an entire line due to the new
# line character so more paragraphs = higher liklihood next paragraph will cause page to be too big (hence why the values
# are descending as paragraph count increases)
def checkPageLength(paragraphCount, pageText):
    return (paragraphCount == 1 and len(pageText) >= 125) or (paragraphCount == 2 and len(pageText) >= 100) \
           or (paragraphCount == 3 and len(pageText) >= 85) or (paragraphCount == 4 and len(pageText) >= 75) \
           or (paragraphCount >= 5 and (len(pageText) >= 60))

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
        endsAtParagraph = False
        endOfChapter = False
        while totalCharacterCount < len(self.text):
            letter = self.text[totalCharacterCount]

            if letter == '\n' and self.text[totalCharacterCount + 1] == '\n' and self.text[
                    totalCharacterCount + 2] == '\n' and self.text[totalCharacterCount + 3] == '\n':
                endOfChapter = True
            else:
                # letter is part of an existing word so append it to that word
                if letter != ' ' and letter != '\u00a0':
                    pageText[wordIndex] = pageText[wordIndex] + letter
                # letter is a space character so begin a new word
                elif letter == ' ' or letter == '\u00a0':
                    pageText.append('')
                    wordIndex += 1
            # Paragraphs always have '\n\n' so when this appears, increment the paragraph count. If this occurs, the
            # current iteration of the while loop has just ended at a paragraph, so the value of paragraphCount can
            # be immediately checked below.
                if letter == '\n' and self.text[totalCharacterCount - 1] == '\n':
                    paragraphCount += 1
                    endsAtParagraph = True

            # Regardless of the letter, increment the character count for the page and the total character count.
            characterCountForPage += 1
            totalCharacterCount += 1
            # If the word is "CHAPTER", stop parsing and add the remaining text on the page to the current chapter. Reset
            # all variables to default values to begin parsing new chapter and page.
            if endOfChapter:
                if chapterNumber not in self.pageDictionary.keys():
                    self.pageDictionary[chapterNumber] = {}
                # Copy remaining text on page to current chapter
                self.pageDictionary[chapterNumber][pageNumber] = pageText
                chapterNumber += 1
                characterCountForPage = 0
                wordIndex = 0
                pageText = ['']
                pageNumber += 1
                paragraphCount = 0
                endOfChapter = False
                totalCharacterCount += 3

            # If the current iterate has ended at a paragraph and a combination of page text and paragraph count constitutes
            # a page, add the page text to the current page number and restart loop with all necessary parameters reset
            # for the next page.
            if (endsAtParagraph and checkPageLength(paragraphCount, pageText)):
                if chapterNumber not in self.pageDictionary.keys():
                    self.pageDictionary[chapterNumber] = {}
                self.pageDictionary[chapterNumber][pageNumber] = pageText
                characterCountForPage = 0
                pageNumber += 1
                wordIndex = 0
                pageText = ['']
                paragraphCount = 0

            endsAtParagraph = False

        # Remaining text for the last page will be excluded since the while loop terminates at the end without adding
        # the last pages text. Append that text to a new existing page, otherwise last page will have too much text.
        self.pageDictionary[chapterNumber][pageNumber] = pageText

    # Method that corrects the indexing in the page dictionary. All chapters and pages should begin at 1 instead of 0
    def correctDictionaryNumbering(self):
        newDict = {}
        for chapter in self.pageDictionary.keys():
            newDict[chapter + 1] = {}
            chapterToPagesDictionary = self.pageDictionary[chapter]
            pageNumbers = chapterToPagesDictionary.keys()
            for page in pageNumbers:
                newDict[chapter+1][page+1] = self.pageDictionary[chapter][page]
        # Reassign the dictionary to the updated one with correct numbering beginning at 1.
        self.pageDictionary = newDict


def main():
    prefixPath = os.getcwd()
    newPath = os.path.abspath(os.path.join(prefixPath, os.pardir))
    docPath = os.path.join(newPath, "docs")
    storyFilePath = os.path.join(docPath, "DrDolittle.docx")
    storyPages = StoryPages(storyFilePath)
    storyPages.parseStoryIntoPages()
    storyPages.correctDictionaryNumbering()

    with open("../../frontend/assets/json_files/parsedPages.json", "w") as outfile:
        json.dump(storyPages.pageDictionary, outfile)


if __name__ == '__main__':
    main()
