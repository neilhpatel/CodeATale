import docx2txt
import os


class DocParser:
    wordSet = set()

    def __init__(self, filePath):
        self.filePath = filePath

    # Parse the database document. Remove all new line and tab characters and then split by the space delimiter.
    def parseDatabase(self):
        text = docx2txt.process(self.filePath)
        filteredText = text.replace("\n", " ").replace("\t", "")
        allWords = filteredText.split()
        # allWords = [word.replace("_", " ") for word in allWords] If we need to remove _ later on, uncomment
        self.wordSet = set(allWords)

    # Parse the story for all words. Lower all text and remove all new line, tab, ':', '”', '“', '.', ',', '?', '!',
    # ';', '"', '(', and ')' characters. Split by the space delimiter after removing those characters.
    def parseDrDolittle(self):
        text = docx2txt.process(self.filePath)
        filteredText = text.lower().replace("\n", " ").replace("\t", "").replace(":", "").replace("”", "")\
            .replace("“", "").replace(".","").replace(",","").replace("?", "").replace("!", "").replace(";", "")\
            .replace('"', "").replace("(", "").replace(")", "")
        allWords = filteredText.split()
        self.wordSet = set(allWords)


# Main method to run DocParser.py. Reads relative file path of cwd which contains database_words.docx
def main():
    prefixPath = os.getcwd()
    databaseFilePath = os.path.join(prefixPath, "database_words.docx")
    databaseDocParser = DocParser(databaseFilePath)
    databaseDocParser.parseDatabase()
    print("Number of unique words in the database: ", len(databaseDocParser.wordSet))

    storyFilePath = os.path.join(prefixPath, "DrDolittle.docx")
    storyParser = DocParser(storyFilePath)
    storyParser.parseDrDolittle()
    print("Number of unique words in Dr. Dolittle: ", len(storyParser.wordSet))

    difference = storyParser.wordSet.difference(databaseDocParser.wordSet)
    print("Difference between database and story: ", difference)
    print("Number of words in Dr. Dolittle and not in database: " ,
          len(storyParser.wordSet.difference(databaseDocParser.wordSet)))

if __name__ == '__main__':
    main()
