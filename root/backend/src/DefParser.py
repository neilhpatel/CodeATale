import docx2txt
import os
import collections
import re


class DefParser():
    """
    For the dictionary:
        key = word and that word's derivatives 
        value = list: 
                    first item is the definition, second item is a list of
                    words that should not be in the pool for incorrect options 
                    for the quizzes

                    note: not all items will have a second item
                    note2: the first item might be 'sightword' this indicates that
                    the word has no definition in the dictionary
    """
    
    wordSet = set()

    def __init__(self, filePath):
        self.filePath = filePath

    def parseWordDocumentText(self):
        text = docx2txt.process(self.filePath)
        filteredText = text.replace("\t", "").replace("]", "")
        allDefs = filteredText.split("\n")

        wordDict = {}

        for word in allDefs:
            filteredWord = re.split(" = | \[xxx ", word)

            key = filteredWord[0]
            wordDict[key] = filteredWord[1:]

            if len(wordDict[key]) == 0:
                wordDict[key] = 'sightWord'

        self.wordSet = set(allDefs)

        self.defDict = wordDict


def main():
    """
    Main method to run DocParser.py. Reads relative file path of cwd which contains database_words.docx
    """
    
    prefixPath = os.getcwd()
    srcPath = os.path.join(prefixPath, "definitions.docx")
    defParser = DefParser(srcPath)
    defParser.parseWordDocumentText()
    print("Number of unique words in the database: ",
          len(defParser.wordSet))

    for key, value in defParser.defDict.items():
        print(key, " | ", value)


if __name__ == '__main__':
    main()
