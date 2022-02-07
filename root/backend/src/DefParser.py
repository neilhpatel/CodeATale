import docx2txt
import os
import collections
import re


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

                lineInd = 0
                # parse the current word
                while line[lineInd] != " " and line[lineInd] != "\n":
                    word += line[lineInd]
                    lineInd += 1
                #increment lineInd to the next non-space character
                while line[lineInd] == ' ':
                    lineInd += 1
                # If the above loop ended at a newline character, current word is a sight word and no more parsing is
                # needed. Else, continue to parse info.
                if line[lineInd] != "\n":
                    # lineInd should now be pointing to either '(' if there are child words or '=' if not
                    # parse child words into array
                    if line[lineInd] == "(":
                        lineInd += 1
                        endSubwords = False
                        currSubword = ""
                        while not endSubwords:
                            if line[lineInd] == ",":
                                childWords.append(currSubword)
                                currSubword = ""
                                lineInd += 2
                            elif line[lineInd] == ")":
                                childWords.append(currSubword)
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
                    if not sightWord:
                        definition = line[lineInd + 2:len(line) - 1]

                # if a word has no definition, it is a sight word
                excludedString = ""
                if definition == "":
                    sightWord = True
                else:
                    for i in range(len(definition)):
                        if definition[i] == '[':
                            excludedString = definition[i:len(definition)]
                            definition = definition[0:i-1]
                            break

                # currently just printing out info, should be easy to change to store in an object or output into a file
                print("Word: " + word)
                print("Is Child? False,\t\tParent Word: \"\"")
                print("Definition: " + definition)
                print("Excluded words: " + excludedString)
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
                    print("Excluded words: ")
                    print("Sight word: ")
                    print("Child words: ")
                    print("\n\n\n")
                startInd = endInd + 2
                # skip newline character in between entries
                textInd += 1
            textInd += 1


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
