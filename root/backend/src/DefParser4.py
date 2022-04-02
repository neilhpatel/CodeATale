import docx2txt
import os


# import firebase_admin
# from firebase_admin import credentials
# from firebase_admin import firestore

# Use a service account
# cwd = os.getcwd()
# jsonFilePath = os.path.join(cwd, "ServiceAccountKey.json")
# cred = credentials.Certificate(jsonFilePath)
# firebase_admin.initialize_app(cred)
#
# db = firestore.client()

class DefParser():

    def __init__(self, filePath):
        self.filePath = filePath
        self.text = docx2txt.process(self.filePath)

    def parseWordDocumentText(self):
        startInd = 0
        endInd = 0
        textInd = 0
        # Get rid of tab characters in parsed document
        self.text = self.text.replace("\t", "")

        #print(self.text[0:len(self.text)])

        # Iterate through the text one character at a time
        while textInd < len(self.text):
            letter = self.text[textInd]
            # Looks for the end of a full word entry, then examines that substring
            if letter == '\n':
                endInd = textInd
                # line is a substring containing the current word entry
                line = self.text[startInd:endInd + 1]
                # BEFOREline = self.text[startInd:endInd+4]
                if line == '\n' or line == '\n\n':
                    textInd += 1
                    startInd = textInd
                    continue
                #print("LINE: " + line)
                word = ""
                definition = ""
                childWords = []
                sightWord = False
                blockedQuizOptions = ""

                lineInd = 0
                # parse the current word
                while line[lineInd] != '=' and line[lineInd] != '\n':
                    word += line[lineInd]
                    lineInd += 1
                word = word.lower()
                word = word.rstrip()

                # lineInd should now be pointing to either '\n' if there is no definition or '=' if so
                if line[lineInd] != "\n":
                    lineInd += 1
                    while line[lineInd] == ' ':
                        lineInd += 1

                    # lineInd should now be pointing to the first non-space character after the '='
                    definition = line[lineInd:len(line)-1].lower()
                    childStartInd = definition.find('(')

                    if childStartInd >= 0:
                        childInd = childStartInd + 1
                        endSubwords = False
                        currSubword = ""
                        while not endSubwords:
                            if definition[childInd] == "," or definition[childInd] == ";":
                                if currSubword.lower() != word:
                                    childWords.append(currSubword.lower())
                                currSubword = ""
                                childInd += 1
                                while definition[childInd] == ' ':
                                    childInd += 1
                            elif definition[childInd] == ")":
                                if currSubword.lower() != word:
                                    childWords.append(currSubword.lower())
                                endSubwords = True
                            else:
                                currSubword += definition[childInd]
                                childInd += 1
                        definition = definition[0:childStartInd]
                        definition = definition.rstrip()

                if definition == "":
                    definition = "MISSING DEFINITION"

                # # populate database; no need to run this every time so it can be commented out until needed
                # collection_ref = db.collection(word[0])
                # doc_ref = collection_ref.document(word)
                # doc_ref.set({
                #     'is_sight_word': False,
                #     'is_child_word': False,
                #     'parent_word': word,
                #     'definition': definition,
                #     'derivative_words': childWords,
                #     'block_from_quiz': "",
                # })
                #
                # for child in childWords:
                #     collection_ref = db.collection(child[0])
                #     doc_ref = collection_ref.document(child)
                #     doc_ref.set({
                #         'is_sight_word': False,
                #         'is_child_word': True,
                #         'parent_word': word,
                #         'definition': "",
                #         'derivative_words': "",
                #         'block_from_quiz': ""
                #     })
                # print to test data values
                print("Word: " + word)
                print("Is Child? False,\t\tParent Word: \"\"")
                print("Definition: " + definition)
                print("Blocked Quiz Options: " + blockedQuizOptions)
                print("Sight word: " + str(sightWord))
                print("Child words: ")
                for child in childWords:
                    print(child)
                print("\n\n\n")
                # pseudo-creating new "words" for child words, can do pretty much the same thing even after changing
                # output method
                for child in childWords:
                    print("Word: " + child)
                    print("Is Child? True,\t\tParent Word: \"" + word + "\"")
                    print("Definition: ")
                    print("Blocked Quiz Options: ")
                    print("Excluded words: ")
                    print("Sight word: ")
                    print("Child words: ")
                    print("\n\n\n")
                startInd = endInd + 2
                textInd += 1
            textInd += 1

def main():
    """
    Main method to run DefParser.py. Reads relative file path of cwd which contains definitions.docx
    """

    prefixPath = os.getcwd()
    newPath = os.path.abspath(os.path.join(prefixPath, os.pardir))
    docPath = os.path.join(newPath, "docs")
    srcPath = os.path.join(docPath, "definitions4.docx")
    defParser = DefParser(srcPath)
    defParser.parseWordDocumentText()

if __name__ == '__main__':
    main()

