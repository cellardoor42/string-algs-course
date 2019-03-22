import React, { Component } from 'react';
import './App.sass';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faSearch } from '@fortawesome/free-solid-svg-icons';

import { naive, kmp, bm, rk } from './algs';

library.add(faFileUpload, faSearch);

class App extends Component {
  text = '';
  fileName = '';
  output = [];
  state = {
    pattern: '',
    loading: false,
    outputString: this.output.join('\n')
  };

  fetchFile() {
    this.setState({
      loading: true
    });

    const fileReader = new FileReader();

    fileReader.onload = (evt) => {
      this.text = evt.target.result;
      this.setState({
        loading: false
      });
    };

    const fileInput = document.getElementById('file-input');
    const fileInputLabel = document.getElementById('file-input_label');
    const file = fileInput.files[0];

    fileInputLabel.innerHTML = `<b>Файл загружен</b>`;
    this.fileName = file.name;
    fileReader.readAsText(file);
  }

  updatePattern(event) {
    this.setState({
      pattern: event.target.value
    });
  }

  search() {
    this.clearOutput();
    if (this.text === '') {
      this.logOutput('Файл не загружен');

      return;
    }

    if (this.state.pattern === '') {
      this.logOutput('Строка поиска не может быть пустой');

      return;
    }

    this.logOutput('ПОИСК ПО ФАЙЛУ');
    this.logOutput(`${this.fileName} (${this.text.length.toLocaleString('RU')} симв.)`);
    this.logOutput(`Паттерн: "${this.state.pattern}"`);
    this.logOutput('');

    const naiveRes = naive(this.text, this.state.pattern);
    this.logOutput(`Наивный алгоритм: найдено вхождений ${naiveRes.entries.length}, время выполнения ${naiveRes.time} мс`);

    const kmpRes = kmp(this.text, this.state.pattern);
    this.logOutput(`Алгоритм Кнута-Морриса-Пратта: найдено вхождений ${kmpRes.entries.length}, время выполнения ${kmpRes.time} мс`);

    const bmRes = bm(this.text, this.state.pattern);
    this.logOutput(`Алгоритм Бойера-Мура: найдено вхождений ${bmRes.entries.length}, время выполнения ${bmRes.time} мс`);

    // const rkRes = rk(this.text, this.state.pattern);
    // this.logOutput(`Алгоритм Рабина-Карпа: найдено вхождений ${rkRes.entries.length}, время выполнения ${rkRes.time} мс`);
  }

  logOutput(str) {
    this.output.push(str);
    this.setState({
      outputString: this.output.join('\n')
    });
  }

  clearOutput() {
    this.output = [];
    this.setState({
      outputString: ''
    });
  }

  render() {
    return (
      <div className='App'>
        <input id='file-input' name='file-input' type='file' accept='.txt' onChange={() => this.fetchFile()} />
        <label for='file-input' id='file-input_label'><FontAwesomeIcon icon='file-upload' className='file-input_icon' />
          {this.state.loading ? 'Загрузка...' : '.txt'}
        </label>
        <input id='pattern' type='text' placeholder='Паттерн' value={this.state.pattern} onChange={(e) => this.updatePattern(e)} />
        <button onClick={() => this.search()}><FontAwesomeIcon icon='search' />&ensp;Поиск</button>
        <textarea readOnly={true} value={this.state.outputString} />
      </div>
    );
  }
}

export default App;
