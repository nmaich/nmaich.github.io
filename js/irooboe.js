// This is a JavaScript file

var FIELD_SIZE = 6;

let colors = ['silver','red','green','blue','yellow','purple','white'];
let colorIdx = [1,2,3,4,5]
colorIdx.splice(getRandomInt(5),1);
let color = colors[1];

let amount = 5;

let answer = Array(FIELD_SIZE*FIELD_SIZE).fill('silver');
let response = Array(FIELD_SIZE*FIELD_SIZE).fill('silver');
let diff = 0
let diffPrev = 0;
let life = 3;

let time = 3;
let timer = 0;

let modes = ['standby', 'memorize', 'recall','result']
//standby: amount, time, life, shiro, colors, (fall, pop), TOmemorize
//memorize: random, countdown, TOrecall
//recall: tap, colorset, check, countmis, TOresult
//result: showresult, TOmemorize, TOstandby

function changeColor(idname,color){
  document.querySelector(idname).style.backgroundColor = color;
}

function modeStandby(){
  mode = 'Standby';
  createStanbyUI();
}

function modeMemorize(){
  mode = 'Memorize';
  createMemorizeUI();
  createField();
  createColors();
  setAnswer(amount);
  setField(answer);
  timer = time;
  countdown();
  life = 3;
}

function modeRecall(){
  mode = 'Recall';
  createRecallUI();
  createField();
  enableFieldTouch();
  createColors();
  response = Array(FIELD_SIZE*FIELD_SIZE).fill('silver');
  diffPrev = 0;
}

function modeResult(){
  mode = 'Result';
  createResultUI();
  createField();
  setField(answer);
}

function createStanbyUI(){
  //set title
  let title = document.querySelector('#title');
  title.innerHTML = '';
  let span = document.createElement('span');
  span.textContent = 'いろおぼえ';
  title.appendChild(span);
  
  //field
  let field = document.querySelector('#field');
  field.innerHTML = '';
  //start button
  let button = document.createElement('ons-button');
  button.setAttribute('modifier', 'large');
  button.textContent = 'Start';
  button.addEventListener('click', function(e) {
    modeMemorize();
  }, false);
  field.appendChild(button);
  //break
  var br = document.createElement("br");
  field.appendChild(br);
  br = document.createElement("br");
  field.appendChild(br);

  //setting
  span = document.createElement('span');
  span.textContent = '設定';
  field.appendChild(span);

  //amount
  let onsrow = document.createElement('ons-row');
  //label
  let onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '50%');
  onscol.setAttribute('align', 'center');
  onscol.textContent = '量';
  onsrow.appendChild(onscol);
  //button
  onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '10%');
  button = document.createElement('ons-button');
  button.className = 'small-button';
  button.textContent = '<';
  button.addEventListener('click', function(e) {
    amount = (amount-1).clamp(0,FIELD_SIZE*FIELD_SIZE);
    document.querySelector('#amount').textContent = amount;
  }, false);
  onscol.appendChild(button);
  onsrow.appendChild(onscol);
  //span
  onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '20%');
  span = document.createElement('span');
  span.id = 'amount'; 
  span.textContent = amount;
  onscol.appendChild(span);
  onsrow.appendChild(onscol);
  //button
  onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '10%');
  button = document.createElement('ons-button');
  button.className = 'small-button';
  button.textContent = '>';
  button.addEventListener('click', function(e) {
    amount = (amount+1).clamp(0,FIELD_SIZE*FIELD_SIZE);
    document.querySelector('#amount').textContent = amount;
  }, false);
  onscol.appendChild(button);
  onsrow.appendChild(onscol);
  //amount end
  field.appendChild(onsrow);

  //time
  onsrow = document.createElement('ons-row');
  //label
  onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '50%');
  onscol.setAttribute('align', 'center');
  onscol.textContent = '時間';
  onsrow.appendChild(onscol);
  //button
  onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '10%');
  button = document.createElement('ons-button');
  button.className = 'small-button';
  button.textContent = '<';
  button.addEventListener('click', function(e) {
    time = (time-0.5).clamp(0,FIELD_SIZE*FIELD_SIZE);
    document.querySelector('#time').textContent = time.toFixed(1);
  }, false);
  onscol.appendChild(button);
  onsrow.appendChild(onscol);
  //span
  onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '20%');
  span = document.createElement('span');
  span.id = 'time'; 
  span.textContent = time.toFixed(1);
  onscol.appendChild(span);
  onsrow.appendChild(onscol);
  //button
  onscol = document.createElement('ons-col');
  onscol.setAttribute('width', '10%');
  button = document.createElement('ons-button');
  button.className = 'small-button';
  button.textContent = '>';
  button.addEventListener('click', function(e) {
    time = (time+0.5).clamp(0,FIELD_SIZE*FIELD_SIZE);
    document.querySelector('#time').textContent = time.toFixed(1);
  }, false);
  onscol.appendChild(button);
  onsrow.appendChild(onscol);
  //timeend
  field.appendChild(onsrow);

  //empty colors
  div = document.querySelector('#colors');
  div.innerHTML = '';
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function createMemorizeUI(){
  let title = document.querySelector('#title');
  title.innerHTML = '';
  let span = document.createElement('span');
  span.textContent = '覚えよう 残り';
  title.appendChild(span);
  span = document.createElement('span');
  span.id = 'timer'
  title.appendChild(span);
  span = document.createElement('span');
  span.textContent = '秒';
  title.appendChild(span);
}

function createRecallUI(){
  let title = document.querySelector('#title');
  title.innerHTML = '';
  let span = document.createElement('span');
  span.textContent = '思い出そう　残りライフ ';
  title.appendChild(span);
  span = document.createElement('span');
  span.id = 'life'
  span.textContent = '';
  for (var i=0; i<life; i++){
  span.textContent += '○';
  }
  title.appendChild(span);
}

function createResultUI(){
  //ResultText
  let title = document.querySelector('#title');
  title.innerHTML = '';
  let span = document.createElement('span');
  if(life > 0) {
    span.textContent = 'クリア！';
  } else {
    span.textContent = 'ざんねん…';
  } 
  title.appendChild(span);

  div = document.querySelector('#colors');
  div.innerHTML = '';
  //Title
  let button = document.createElement('ons-button');
  button.className = 'big-button';
  button.textContent = 'Title';
  button.addEventListener('click', function(e) {
    modeStandby();
  }, false);
  div.appendChild(button);
  //Retry
  button = document.createElement('ons-button');
  button.className = 'big-button';
  button.textContent = 'Retry';
  button.addEventListener('click', function(e) {
    modeMemorize();
  }, false);
  div.appendChild(button);
  //LevelUp
  button = document.createElement('ons-button');
  button.className = 'big-button';
  button.textContent = 'LevelUp';
  button.addEventListener('click', function(e) {
    amount++;
    modeMemorize();
  }, false);
  div.appendChild(button);

}

function createField(){
  //add HTML
  let id = 0;
  let field = document.querySelector('#field');
  field.innerHTML = '';
  for (var i = 0; i < FIELD_SIZE; i++) {
    let row = document.createElement('ons-row');
    row.className = 'row';
    for (var j = 0; j < FIELD_SIZE; j++) {
      id += 1;
      let cell = document.createElement('ons-col');
      cell.id = 'S'+id;
      cell.className = 'cell';
      cell.innerHTML = '';
      row.appendChild(cell);
    }
  field.appendChild(row);
  }
}

function enableFieldTouch(){
  //add eventlistener
  let NodeList = document.querySelectorAll('.cell');
  for (var i = 0, len = NodeList.length; i < len; i++) {
    NodeList[i].addEventListener('click', function(e) {
      changeColor('#'+e.target.id, color)
      checkField(e.target.id.slice(1))
    }, false);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function setAnswer(amount, jama){
  colorIdx = [1,2,3,4,5]
  colorIdx.splice(getRandomInt(5),1);
  answer = Array(FIELD_SIZE*FIELD_SIZE).fill('silver');
  for (var i=0; i<FIELD_SIZE*FIELD_SIZE; i++){
    if(i<amount){
      answer[i] = colors[colorIdx[getRandomInt(colorIdx.length)]];
    } 
  }
  fisherYatesShuffle(answer);
  console.log(answer);
}

function fisherYatesShuffle(arr){
    for(var i =arr.length-1 ; i>0 ;i--){
        var j = Math.floor( Math.random() * (i + 1) ); //random index
        [arr[i],arr[j]]=[arr[j],arr[i]]; // swap
    }
}

function setField(arr){
  let NodeList = document.querySelectorAll('.cell');
  for (var i = 0, len = NodeList.length; i < len; i++) {
    NodeList[i].style.backgroundColor = arr[i];
  }
}

function createColors(){
  //add HTML
  let div = document.querySelector('#colors');
  div.innerHTML = '';
  let span = document.createElement('span');
  span.innerHTML = '色選択';
  div.appendChild(span);
  let row = document.createElement('ons-row');
  row.className = 'color-row';
  for (var i=0, len = colors.length; i<len; i++){
    let col = document.createElement('ons-col'); 
    col.className = 'color';
    col.id = colors[i];
    col.style.backgroundColor = colors[i];
    row.appendChild(col);
  }
  div.appendChild(row);
  //add Eventlistener
  let NodeList = document.querySelectorAll('.color');
  for (var i = 0, len = NodeList.length; i < len; i++) {
    NodeList[i].addEventListener('click', function(e) {
      color = e.target.id;
      hilightBorder(e.target.id);
    }, false);
  }
}

function hilightBorder(id){
  let NodeList = document.querySelectorAll('.color');
  for (var i = 0, len = NodeList.length; i < len; i++) {
    if(id == NodeList[i].id ){
      NodeList[i].style.border = 'medium solid black';
    } else {
      NodeList[i].style.border = 'transparent';
    }
  }
}

function checkField(idx) {
  if(response[idx-1] != colors[0]){
    //already changed
    return;
  }
  response[idx-1] = color;
  //count diff
  diff = 0;
  for (var i=0; i<FIELD_SIZE*FIELD_SIZE; i++){
    if(response[i] != answer[i]){
      diff++;
    }
  }
  if (diff == 0) {
    //clear
    modeResult();
  }

  if (diffPrev == 0) {
    //first time
    diffPrev = amount;
  }

  if(diff == diffPrev - 1){
    //correct
    diffPrev = diff;
  } else {
    //miss
    life--;
    let span = document.querySelector('#life');
    span.textContent = span.textContent.slice(1)+'　';

    /*
    span.textContent = '';
    for (var i=0; i<life; i++){
    span.textContent += '○';
    }
    */
    //turn back color
    response[idx-1] = colors[0];
    setTimeout('changeColor("#S'+idx+'", colors[0]);',50);
    if(life == 0){
      //gameover
      setTimeout('modeResult();',300);
    }
  }

}


function countdown(){
  timer -= 0.1;
  document.querySelector('#timer').textContent=timer.toFixed(1);
  var id = setTimeout(countdown, 100);
  if(timer <= 0){
    clearTimeout(id);
    modeRecall();
  }
}


window.onload = function() {
  mode = 'standby';
  modeStandby();

};
