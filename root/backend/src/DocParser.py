import docx2txt
import os


class DocParser:
    wordSet = set()

    def __init__(self, filePath):
        self.filePath = filePath

    # Parse the word document for text. Remove all new line and tab characters and then split by the space delimiter.
    def parseWordDocumentText(self):
        text = docx2txt.process(self.filePath)
        filteredText = text.replace("\n", " ").replace("\t", "")
        allWords = filteredText.split()
        # allWords = [word.replace("_", " ") for word in allWords] If we need to remove _ later on, uncomment
        self.wordSet = set(allWords)


# Main method to run DocParser.py. Reads relative file path of cwd which contains database_words.docx
def main():
    prefixPath = os.getcwd()
    srcPath = os.path.join(prefixPath, "database_words.docx")
    databaseDocParser = DocParser(srcPath)
    databaseDocParser.parseWordDocumentText()
    print("Number of unique words in the database: ", len(databaseDocParser.wordSet))


if __name__ == '__main__':
    main()
