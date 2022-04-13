import docx2txt
import os


import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cwd = os.getcwd()
jsonFilePath = os.path.join(cwd, "ServiceAccountKey.json")
cred = credentials.Certificate(jsonFilePath)
firebase_admin.initialize_app(cred)

db = firestore.client()

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

        # Iterate through the text one character at a time
        while textInd < len(self.text):
            letter = self.text[textInd]
            # Looks for the end of a full word entry, then examines that substring
            if letter == '\n':
                endInd = textInd
                # line is a substring containing the current word entry
                line = self.text[startInd:endInd + 1]

                word = ""
                definition = ""
                childWords = []
                sightWord = False
                blockedQuizOptions = ""

                lineInd = 0
                # parse the current word
                while line[lineInd].isalpha() or line[lineInd] == '-' or line[lineInd] == '\'':
                    word += line[lineInd]
                    lineInd += 1
                word = word.lower()

                #increment lineInd to the next non-space character
                while line[lineInd] == ' ':
                    lineInd += 1
                # If the above loop ended at a newline character, current word is a sight word and no more parsing is
                # needed. Else, continue to parse info.
                # if (word == "ask"):
                #     print(line[lineInd])
                if line[lineInd] != "\n":
                    # lineInd should now be pointing to either '(' if there are child words or '=' if not
                    # parse child words into array
                    if line[lineInd] == "(":
                        lineInd += 1
                        endSubwords = False
                        currSubword = ""
                        while not endSubwords:
                            if line[lineInd] == "," or line[lineInd] == ";" or line[lineInd] == "'":
                                childWords.append(currSubword.lower())
                                currSubword = ""
                                lineInd += 2
                            elif line[lineInd] == ")":
                                childWords.append(currSubword.lower())
                                endSubwords = True
                            else:
                                currSubword += line[lineInd]
                                lineInd += 1
                        #make lineInd point to character right after ')'
                        lineInd += 1
                        # make lineInd point to the next non-space character, should either be '/n' if sight word
                        # and '=' if not
                        while line[lineInd] == ' ':
                            lineInd += 1
                        if line[lineInd] == '\n':
                            sightWord = True
                    # parse the definition by looking at everything on the current line past the '=' character
                    definition = line[lineInd+2:len(line)-1].lower()
                    if ("[" in definition):
                        start = definition.index("[")
                        blockedQuizOptions = definition[start+4:len(definition)-1]
                        definition = definition[:start]
                    #if not sightWord:
                     #   definition = line[lineInd + 2:len(line) - 1]

                # if a word has no definition, it is a sight word
                excludedString = ""
                if definition == "":
                    sightWord = True
                else:
                    for i in enumerate(definition):
                        if i[1] == '[':
                            excludedString = definition[i[0]:len(definition)]
                            definition = definition[0:i[0]-1]
                            break

                # populate database; no need to run this every time so it can be commented out until needed
                collection_ref = db.collection(word[0])
                doc_ref = collection_ref.document(word)
                doc_ref.set({
                    'is_sight_word': sightWord,
                    'is_child_word': False,
                    'parent_word': word,
                    'definition': definition,
                    'derivative_words': childWords,
                    'block_from_quiz': blockedQuizOptions,
                })

                for child in childWords:
                    collection_ref = db.collection(child[0])
                    doc_ref = collection_ref.document(child)
                    doc_ref.set({
                        'is_sight_word': False,
                        'is_child_word': True,
                        'parent_word': word,
                        'definition': "",
                        'derivative_words': "",
                        'block_from_quiz': ""
                    })
                # # print to test data values
                # print("Word: " + word)
                # print("Is Child? False,\t\tParent Word: \"\"")
                # print("Definition: " + definition)
                # print("Blocked Quiz Options: " + blockedQuizOptions)
                # print("Excluded words: " + excludedString)
                # print("Sight word: " + str(sightWord))
                # print("Child words: ")
                # for child in childWords:
                #     print(child)
                # print("\n\n\n")
                # # pseudo-creating new "words" for child words, can do pretty much the same thing even after changing
                # # output method
                # for child in childWords:
                #     print("Word: " + child)
                #     print("Is Child? True,\t\tParent Word: \"" + word + "\"")
                #     print("Definition: ")
                #     print("Blocked Quiz Options: ")
                #     print("Excluded words: ")
                #     print("Sight word: ")
                #     print("Child words: ")
                #     print("\n\n\n")
                startInd = endInd + 2
                # skip newline character in between entries
                textInd += 1
            textInd += 1
         # adding last word
        last_line = self.text[startInd:]
        last_word = last_line[0:last_line.index("=")].lower()
        last_definition = last_line[last_line.index("=")+2:last_line.index("[")].strip().lower()
        last_blocked_quiz_options = last_line[last_line.index("graze"):-1].lower()

        collection_ref = db.collection(last_word[0])
        doc_ref = collection_ref.document(last_word)
        doc_ref.set({
            'is_sight_word': False,
            'is_child_word': False,
            'parent_word': last_word,
            'definition': last_definition,
            'derivative_words': [],
            'block_from_quiz': last_blocked_quiz_options,
        })


def main():
    """
    Main method to run DefParser.py. Reads relative file path of cwd which contains definitions.docx
    """

    prefixPath = os.getcwd()
    newPath = os.path.abspath(os.path.join(prefixPath, os.pardir))
    docPath = os.path.join(newPath, "docs")
    srcPath = os.path.join(docPath, "definitions.docx")
    defParser = DefParser(srcPath)
    defParser.parseWordDocumentText()

if __name__ == '__main__':
    main()
