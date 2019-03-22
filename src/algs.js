/*
* Наивный алгоритм
* */
export const naive = (text, pattern) => {
  const start = Date.now();
  const entries = [];

  for (let i = 0; i < text.length - pattern.length; i++) {
    if (text.substr(i, pattern.length) === pattern) {
      entries.push(i);
    }
  }

  const end = Date.now();

  console.log('НАИВНЫЙ АЛГОРИТМ');
  console.log(`Найдено вхождений: ${entries.length}`);
  // console.log('Индексы вхождений:');
  // entries.forEach(entry => {
  //   console.log(entry);
  // });
  console.log(`Время выполнения: ${end - start} мс`);
  console.log('----------');

  return {
    entries,
    time: end - start
  }
};

/*
* Префикс-функция для алгоритма Кнута-Морриса-Пратта
* */
const prefix = (s) => {
  const pi = [];

  for (let i = 0; i < s.length; i++) {
    pi.push(0);
  }

  for (let i = 1; i < s.length; ++i) {
    let j = pi[i - 1];
    
    while (j > 0 && s[i] !== s[j]) {
      j = pi[j - 1];
    }

    if (s[i] === s[j]) ++j;
    pi[i] = j;
  }

  return pi;
};

/*
* Алгоритм Кнута-Морриса-Пратта
* */
export const kmp = (text, pattern) => {
  const start = Date.now();
  let k = 0;
  const f = prefix(pattern);
  const entries = [];

  for (let i = 0; i < text.length; i++) {
    while (k > 0 && pattern[k] !== text[i]) { k = f[k - 1]; }

    if (pattern[k] === text[i]) { k++; }

    if (k === pattern.length) {
      entries.push(i - pattern.length + 1);
    }
  }

  const end = Date.now();

  console.log('АЛГОРИТМ КНУТА-МОРРИСА-ПРАТТА');
  console.log(`Префикс-функция от искомой подстроки: [${f}]`);
  console.log(`Найдено вхождений: ${entries.length}`);
  // console.log('Индексы вхождений:');
  // entries.forEach(entry => {
  //   console.log(entry);
  // });
  console.log(`Время выполнения: ${end - start} мс`);
  console.log('----------');

  return {
    entries,
    time: end - start
  };
};

const getShift = (shiftStr, shift, symbol) => {
  if (shiftStr.includes(symbol)) {
    return shift[shiftStr.indexOf(symbol)];
  }

  return shiftStr.length + 1;
};

/*
* Алгоритм Бойера-Мура
* */
export const bm = (text, pattern) => {
  const start = Date.now();
  const shiftStr = pattern.substr(0, pattern.length - 1);
  const entries = [];

  const shift = [];

  for (let i = 0; i < shiftStr.length; i++) {
    shift.push(shiftStr.length - shiftStr.lastIndexOf(shiftStr.charAt(i)));
  }

  shift.push(pattern.length);

  for (let i = pattern.length - 1, j = pattern.length - 1; i < text.length;) {
    let returnTo = i, match = 0, t, p;
    do {
      t = text.charAt(i);
      p = pattern.charAt(j);
      if (t === p) {
        j--;
        i--;
        match++;
      }
    } while (t === p && i >= 0 && j >= 0);

    if (j === -1) {
      entries.push(i + 1);
      i = returnTo + 1;
    } else {
      if (getShift(shiftStr, shift, t) <= match) {
        match = 0;
      }

      i = returnTo + getShift(shiftStr, shift, t) - match;
    }

    j = pattern.length - 1;
  }

  const end = Date.now();

  console.log('АЛГОРИТМ БОЙЕРА-МУРА');
  console.log(`Найдено вхождений: ${entries.length}`);
  // console.log('Индексы вхождений:');
  // entries.forEach(entry => {
  //   console.log(entry);
  // });
  console.log(`Время выполнения: ${end - start} мс`);
  console.log('----------');

  return {
    entries,
    time: end - start
  };
};

const P = 3; // коэффициент хэширования для алгоритма Рабина-Карпа

/*
* Функция вычисления полиномиального хэша строки
* */
const hash = (s) => {
  let hashSum = 0;
  for (let i = 0;  i < s.length; i++) {
    hashSum += Math.pow(P, i) * s.charCodeAt(i);
  }

  return hashSum;
};

/*
* Алгоритм Рабина-Карпа
* */
export const rk = (text, pattern) => {
  const start = Date.now();
  const entries = [];
  let hashT = hash(text.substr(0, pattern.length - 1));
  const hashP = hash(pattern);
  const r = Math.random() * 10000000;

  for (let i = 0; i < text.length - pattern.length; i++) {
    console.log(hashT, hashP);
    if (hashT === hashP) { entries.push(i); }

    if (i + pattern.length === text.length) {
      hashT = (P * hashT - Math.pow(P, pattern.length) * hash(text[i]) + hash('')) % r;
    } else {
      hashT = (P * hashT - Math.pow(P, pattern.length) * hash(text[i]) + hash(text[i + pattern.length])) % r;
    }
  }

  const end = Date.now();

  console.log('АЛГОРИТМ РАБИНА-КАРПА');
  console.log(`Полиномиальный хэш искомой подстроки: [${hashP}]`);
  console.log(`Найдено вхождений: ${entries.length}`);
  // console.log('Индексы вхождений:');
  // entries.forEach(entry => {
  //   console.log(entry);
  // });
  console.log(`Время выполнения: ${end - start} мс`);
  console.log('----------');

  return {
    entries,
    time: end - start
  };
};