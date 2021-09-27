import unittest
import os

from src.DocParser import DocParser


class TestDocParser(unittest.TestCase):

    def setUp(self):
        prefixPath = os.getcwd()
        srcPath = os.path.join(prefixPath, "testDatabase.docx")
        self.DocParser = DocParser(srcPath)
        self.DocParser.parseWordDocumentText()

    # Test if the number of underscore words in the testDatabase matches the actual result of 24
    def test_UnderscoreWords(self):
        underScoreWords = [word for word in self.DocParser.wordSet if '_' in word]
        self.assertEqual(len(underScoreWords), 24)

    # Test if the number of words with parenthesis and brackets match their actual count in the testDatabase
    def test_ParenthesisAndBrackets(self):
        parenthesisWords = [word for word in self.DocParser.wordSet if '(' in word and ')' in word]
        self.assertEqual(len(parenthesisWords), 10)
        self.assertTrue(all(elem in parenthesisWords for elem in
                            ['bigfoot_sasquatch_(scary)', 'deer_(plural)', 'moose_(plural)', 'tear_(=rip)',
                             'tears_(=cries)']))
        bracketWords = [word for word in self.DocParser.wordSet if '[' in word and ']' in word]
        self.assertEqual(len(bracketWords), 2)
        self.assertTrue(all(elem in bracketWords for elem in ['close[near]', 'close[shut]']))

    # Test the cumulative word count matches the actual count in testDatabase
    def test_CumulativeWordCount(self):
        self.assertEqual(len(self.DocParser.wordSet), 37)
