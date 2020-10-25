import React from 'react';
import logo from './logo.svg';
import { Corpus } from "tiny-tfidf";
import './App.css';

let testTitle = ['test'];
let testText = ['hello goodbye farewell farewell angry'];

function testTextAnalyze() {
  let corpus = new Corpus(testTitle, testText);
  return corpus.getStopwords().getStopwordList();
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {testTextAnalyze()}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}



export default App;
