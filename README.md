# Read Dr. Dolittle | 🔖 HearATale 📖
###### Designed by Junior-Design-JIC-Group1338 (CodeATale)

&nbsp;

![HearATale Banner](https://github.com/BrainyEducation/HearATale/blob/master/images/bookbanner.jpg)

Read Dr. Dolittle is a web app designed to teach students in middle or high school to read using an interactive learning app that reads aloud, quizzes students on, and provides vocab definitions in the literary classic Dr. Dolittle. 

### Motivation
Illiteracy in children is a major issue - students that cannot read early on often fail to reach their full potential in life. Oftentimes, teachers are unable to separatly tutor individual stuggling students when the parents are unable or unwilling to help. This web-based app is designed to help these struggling students become proficient readers.

### Build Status
Development is finished and codebase is currently ready for handoff to client.

## Install Guide

### 1. Prerequisites
To clone and run this application, you will need [Git](https://git-scm.com/) installed on your computer. To run any of the python files in the backend folder, you will need [Python](https://www.python.org/downloads/) installed on your computer (this is not required to run the actual application).

### 2. Installation
Open a terminal or command prompt.
```
# Clone this repository
$ git clone https://github.com/neilhpatel/CodeATale.git
```
Alternatively, you can download ZIP of the repository by clicking on code, and clicking on download ZIP. If you want to simply run the application and do not wish to run any individual files or write to the database, skip to step 4 (Run the application).

```
# Go into the repository
$ cd CodeATale
```
Add ServiceAccountKey.json to the CodeATale/root/backend/src folder. This will allow developers to write words and all corresponding attributes (definition, is_sight_word, is_child_word, parent_word, derivative_words, and block_from_quiz) to the database. The files DefParser.py, DefParser2.py, DefParser3.py, and DefParser4.py require ServiceAccountKey.json to execute.

```
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
4. Reading Screen Page
5. Quiz Screen
6. Review page
   * View information for each highlightable word that has been clicked on
      * If the definition was queued
      * The highest score
      * Total number of times correct
      * Total number of times incorrect
      * Date quiz was last accessed
7. Quiz page
   * Select the word that matches the given definition out of 4 options
   * Keeps track of the number of consecutive correct answers for a specific word (represented by gold stars)
   * Help button
      * Provides brief explanation for how the quiz works
8. Reading page
   * Access the bookmark widget
   * Read the story (all of the book’s text will be on the reading page)
   * Play an voice acted audio reading of the current page
   * Click on highlightable words and listen to them being spoken
   * Double click on highlightable words to view their definition and listen to the definition being read aloud

### Bugs/Issues
1. In the review screen, a number shows the highest score rather than gold stars.
2. In the review screen, clicking on a word does not add that word to the quiz queue
3. In the quiz screen, there is no queue for the user to see what words they are going to be quizzes on
4. Only looks correct on mobile if viewed in landscape mode

### Credits
* [Dr. Walter Evans](mailto:wevans@augusta.edu)
* [JIC Team 1338](mailto:jjohnson660@gatech.edu)
    * Assata Quinichett
    * Collin Hubbard
    * James Johnson
    * Jinuk Yun
    * Neil Patel
    * Pranathi Singareddy

### License
* The open source license chosen for this project is the [MIT License](https://choosealicense.com/licenses/mit/).
* Questions regarding IP should be directed to Amanda Girard at [amanda.girard@lmc.gatech.edu](mailto:amanda.girard@lmc.gatech.edu).
