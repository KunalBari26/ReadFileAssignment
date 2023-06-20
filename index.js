const fs = require('fs');
const path = require('path');

//class for performing the need task
class Dictionary{
  constructor(pagesDir, excludeWordsFile, indexFile){
    this.pagesDir = pagesDir;
    this.excludeWordsFile = excludeWordsFile;
    this.indexFile = indexFile;
    this.excludeWords = new Set();
    this.index = {};
  }

  wordExclusion(){
    const excludeWordsData = fs.readFileSync(this.excludeWordsFile, 'utf8');
    const excludeWords = excludeWordsData.split('\n');
    excludeWords.forEach(e=>{
      let word=e.trim()
      if(word!=='')
      this.excludeWords.add(word.toLowerCase());
    })
  }

  pageReading(){
    const files = fs.readdirSync(this.pagesDir);
    for (const file of files) {
      const filePath = path.join(this.pagesDir, file);
      const pageData = fs.readFileSync(filePath, 'utf8');
      const pageWords = pageData.split(/\s+/);
      const pageNumber = parseInt(file.match(/\d+/)[0]); 

      for (const word of pageWords) {
        const cleanedWord = this.removeUnwanted(word);
        if (cleanedWord !== '' && !this.excludeWords.has(cleanedWord)) {
          if (!this.index[cleanedWord]) {
            this.index[cleanedWord] = new Set();
          }
          this.index[cleanedWord].add(pageNumber);
        }
      }
    }
  }

  //this function will remove all the words/charcters which are unwanted
  removeUnwanted(word){
      const cleanedWord = word.trim().toLowerCase().replace(/[^\w\s]/g, '');//remove charcters and white spaces
      return /\d/.test(cleanedWord) ? '' : cleanedWord; //only return those which are not numbers
  }

  pageNumber() {
    let indexContent = '';
    const sortedWords = Object.keys(this.index).sort();
    const heading = 'Word'+' : '+'Page Numbers' + `\n` +'---------------------' +`\n`
    fs.writeFileSync(this.indexFile,heading)
    for (const word of sortedWords) {
      const pages = Array.from(this.index[word]).join(',');
      indexContent += `${word} : ${pages}\n`;
    }
    
    fs.appendFileSync(this.indexFile, indexContent);
  }

  run() {
    //this will creat a set of all word which needed to be excluded
    this.wordExclusion(); 

    //this will read each page present in the directory
    this.pageReading(); 

    //this will write words and their page number in the index file
    this.pageNumber(); 

    console.log('Dictionary Created');
  }
}



const dictionary = new Dictionary('pages', 'exclude-words.txt', 'index.txt');
dictionary.run();


/**
 * Author of the file : Kunal Bhagwat Bari
 */