# Read Dr. Dolittle | 🔖 HearATale 📖
###### Designed by Junior-Design-JIC-Group1338 (CodeATale)

&nbsp;

![HearATale Banner](https://github.com/BrainyEducation/HearATale/blob/master/images/bookbanner.jpg)

Read Dr. Dolittle is a web app designed to teach students in middle or high school to read using an interactive learning app that reads aloud, quizzes students on, and provides vocab definitions in the literary classic Dr. Dolittle. 

### Motivation
Illiteracy in children is a major issue - students that cannot read early on often fail to reach their full potential in life. Oftentimes, teachers are unable to separatly tutor individual stuggling students when the parents are unable or unwilling to help. This web-based app is designed to help these struggling students become proficient readers.

### Build Status
Development is finished and codebase is currently ready for handoff to client.

## Installation Guide

### 1. Prerequisites
To clone and run this application, you will need [Git](https://git-scm.com/) installed on your computer. To run any of the python files in the backend folder, you will need [Python](https://www.python.org/downloads/) installed on your computer (this is not required to run the actual application).

### 2. Installation
Open a terminal or command prompt.
``` bash
# Clone this repository
$ git clone https://github.com/neilhpatel/CodeATale.git
```
Alternatively, you can download ZIP of the repository by clicking on code, and clicking on download ZIP. If you want to simply run the application and do not wish to run any individual files or write to the database, skip to step 4 (Run the application).

``` bash
# Go into the repository
$ cd CodeATale
```
Add ServiceAccountKey.json to the CodeATale/root/backend/src folder. This will allow developers to write words and all corresponding attributes (definition, is_sight_word, is_child_word, parent_word, derivative_words, and block_from_quiz) to the database. The files DefParser.py, DefParser2.py, DefParser3.py, and DefParser4.py require ServiceAccountKey.json to execute.

``` bash
# Install dependencies
python -V #Check python version
pip install -r requirements.txt  #if you have Python 2.x.x
pip3 install -r requirements.txt #if you have Python 3.x.x
```
### 3. Build
No build is necessary for this application.

### 4. Run the application
**Option 1 (recommended): Run index.html using an integrated development environment (IDE). [IntelliJ](https://www.jetbrains.com/help/idea/installation-guide.html#standalone), [PyCharm](https://www.jetbrains.com/help/pycharm/installation-guide.html#standalone), and [VSCode](https://code.visualstudio.com/download) can be used.**
 * With IntelliJ/PyCharm, open the repository and navigate to the index.html file located in CodeATale/root/frontend/public/html. At the top right of the file, there should be icons for chrome, Firefox, Safari, and any other browsers. Click on your preferred browser.
 * With VSCode, open the repository. Navigate to the extensions tab on the left sidebar and search and download the extension Live Server by Ritwick Dey in Marketplace (usually first option). After installation, navigate to the index.html file in CodeATale/root/frontend/public/html. Double click anywhere in the file and select “Open with Live Server”. Note the default browser opened can be changed by going to Files > Preferences > Settings > Extensions > Live Server > Custom Browser

**Option 2: Run index.html using a Google Chrome extension.**
   * Open Google Chrome and download the [“Web Server for Chrome” Extension](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en). After installation, click Launch app. Click Choose Folder and navigate to CodeATale/root and select the frontend folder. You should see “Current: /frontend” on the extension page. Now, click on the Web Server URL link and click on public/ and html/ and the application will open.

### 5. Troubleshooting
1. I am getting a `No module named docx2txt`, `No module named pydub`, or `No module named firebase_admin` error when running a python file.
   * Install the necessary dependencies using the pip install command listed above.
2. I am trying to run DefParser.py, DefParser2.py, DefParser3.py, or DefParser4.py but am getting the error `No such file or directory …/ServiceAccountKey.json`.
   * You need to place the file ServiceAccountKey.json inside the CodeATale/root/backend/src folder.
3. I am on the reading screen but none of the words are being highlighted.
   * This likely means the daily limit of reads/writes for Firebase has been exceeded. You need to either wait until the limit is reset around midnight Pacific time or upgrade your plan to allow more reads/writes to the database.
4. I am trying to use option 2 to run the application, but the reading screen is blank.
   * You likely selected the incorrect folder instead of the folder titled `frontend`.
5. I am opening index.html directly from my file directory but the application is blank except for the text "Choose a Chapter and Start Reading"
   * Unfortunately, this application does not support direct opening of index.html and requires an equivalent of a live server as mentioned in step 4 of the Installation Guide.


### 6. Database Information
**Project Name:** Junior Design

**Project ID:** junior-design-178a

**Plan:** Spark Plan - This plan requires $0 a month. It has usage quotas for Database, Firestore, Storage, Functions, Phone Auth, Hosting, & Test Lab. We recommend upgrading to the Blaze plan for optimal use to eliminate any bugs caused from reaching such quotas; however the Blaze plan will have a pay as you go pricing model. For more information, check out the [Firebase pricing plans](https://firebase.google.com/pricing?authuser=0&hl=en).

#### Resources Used:
1) *Firestore Database:* <br>
    This database largely contains information pertaining to users and individual words from the story. The database organizes information by collections, which contain documents, which store specific information.

    *Structure of Data:*
    One collection is called `Users`. All of the documents within this collection are distinct usernames (ex: “mtl10”, “neil”). Information is included as follows, on a document by document basis:
    * bookMarkList
    * chapterProgress
    * pagesViewed
    * queue

    There are 26 other collections, each labeled with one lowercase letter in the alphabet (“a”, “b”, “c”, …. “z”). Each of these collections includes numerous documents labeled with distinct words that begin with the collection letter. For example, “aback” and “abandon” are documents within the “a” collection. Information is included as follows, on a document by document basis:
    * block_from_quiz (str) - contains all the words that should be excluded as quiz answer options for the quiz of the word (see document label)
    * definition (str) - definition of the word (see document label)
    * derivative_words (list) - list of derivative words (str) of the word (see document label)
    * is_child_word (bool) - describes if the word (see document label)
    * is_sight_word (bool) - describes if the word (see document label) is a sight word
    * parent_word (bool) - describes if the word (see document label) is a parent word

    Note that all information across these collections, documents, and specific information is lower-case. Child words refer to words that are derivatives of another word. Parent words refer to words that have derivative words. Sight words refer to words that are simple enough such that the user requires no highlight/quiz feature in the application.

    Consult [the Firestore documentation](https://firebase.google.com/docs/firestore?hl=en&authuser=1) for instructions on how to properly read and write from this database.

2) *Storage:* <br>
    This database stores audio files on a page by page basis, organized by chapter.

    *Structure of Data:*
    * Folders listed in “Chapter {Number}/” format where {Number} gets replaced by the target chapter number
    * Within the folder, audio files are listed in “Chapter{Number}_Page{Number}.mp3” format where the first {Number} is the target chapter number and the second {Number} is the target page number

    *Note that all pages do not have audio yet.*

    Consult [the Cloud Storage documentation](https://firebase.google.com/docs/storage/web/start?hl=en&authuser=1) for instructions on how to properly read and write from this database.


## Release Notes

### Software features (version 1.0):
1. Chapter selection page
   * Select which chapter to read
   * Access the bookmark widget
   * Select which chapter’s image gallery to view
   * Check on chapter progress

2. Bookmark widget - all bookmarks are stored in a database and saved between sessions
   * Create a bookmark for current page
   * Delete a bookmark
   * Go to a bookmark’s page

3. Gallery Screen
   * View the images for a particular chapter
   * Read the captions for the chapter's images

4. Reading page
   * Access the bookmark widget
   * Read the story (all of the book’s text will be on the reading page)
   * Play audio narration of the story text on the current page
   * Click on highlightable words and listen to them being spoken by a real person
   * Double click on highlightable words to view their definition and listen to the definition being read aloud
      * Can add the word to the quiz queue or go to a quiz directly when viewing the definition   

5. Quiz page
   * Select the word that matches the given definition out of 4 options
   * Keeps track of the number of consecutive correct answers for a specific word (represented by gold stars)
   * Navigate between quizzes for different words if multiple words have been added to the quiz queue
   * Help button
      * Provides brief explanation for how the quiz works

6. Review page
   * View information for each highlightable word that has been clicked on
      * If the definition was queued
      * The highest score
      * Total number of times correct
      * Total number of times incorrect
      * Date quiz was last accessed

### Bugs/Issues
 1. In the review screen, a number shows the highest score rather than gold stars.
 2. In the review screen, clicking on a word does not add that word to the quiz queue.
 3. In the quiz screen, there is no queue for the user to see what words they are going to be quizzed on.
 4. Only looks correct on mobile if viewed in landscape mode.
 5. There is missing story audio at the end of Chapters 5 and 11.
 6. Usernames are currently hardcoded and should instead by replaced with the username verified from the login of the [Brainy Literacy HearATale Application](http://brainyliteracyapp.hearatale.org/#/).

### Credits
* Project Director: [Dr. Walter Evans](mailto:wevans@augusta.edu)
* Developers: [JIC Team 1338](mailto:jjohnson660@gatech.edu)
   * Assata Quinichett
   * Collin Hubbard
   * James Johnson
   * Jinuk Yun
   * Neil Patel
   * Pranathi Singareddy
* In collaboration with nonprofit [HearATale](https://www.hearatale.com/)

### License
* The open source license chosen for this project is the [MIT License](https://choosealicense.com/licenses/mit/).
* Questions regarding IP should be directed to Amanda Girard at [amanda.girard@lmc.gatech.edu](mailto:amanda.girard@lmc.gatech.edu).
