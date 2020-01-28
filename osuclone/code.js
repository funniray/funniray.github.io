var maps = [];
var map;
var startTime;
var noLongerNote = 0;
var bonus = 100;
var score = 0;
var grades = {"Perfect":0,"Great":0,"Good":0,"Ok":0,"Meh":0,"Miss":0};
var frameTimes = [];
var lastFrameLength;
var drawInt;
var tries = 0;
var isFrameDrawing = false;

var keys = ["d","f","j","k"];
var gradeList = ["Perfect","Great","Good","Ok","Meh","Miss"];
var mapListID = [0,476691,332623,277421,157896,444632];
setProperty("songSelect","options",["Select a song","Flower Dance","Kakushinteki*Metamaruphose!","Senbonzakura","Monster","STYX HELIX"]);

setActiveCanvas("canvas1");


var objSpeed = 2;
var frameRate = 60;


function draw() {
  if (isFrameDrawing) {
    return;
  }
  isFrameDrawing = true;
  var frameStartTime = getTime();
  clearCanvas();
  var timeOffset = getTime() - startTime;
  if (map.hitObjects.length == 0) {
    showEndScreen();
  }
  for (var i = noLongerNote; i<map.hitObjects.length; i++){
    var object = map.hitObjects[i];
    if (object.startTime < timeOffset-158) { //Checks if it's below the screen
      map.hitObjects.splice(i,1);
      bonus = 0;
      grades.Miss++;
      setText("lastHit","Miss");
      continue;
    }
    if (object.startTime-timeOffset > 420*objSpeed) { //Checks if it's above the screen
      break;
    }
    var col = (object.position[0]-64)>>7;
    if (col === 0 || col === 3) {
      setFillColor(rgb(204, 0, 204));
    } else {
      setFillColor(rgb(0, 204, 0));
    }
    rect(col*80,400-((object.startTime-timeOffset)/objSpeed),80,20);
  }
  frameTimes.push(getTime()/1000);
  if (frameTimes.length > frameRate) {
    frameTimes.shift();
  }
  setText("gameFramerate",frameTimes.length/Math.round(frameTimes[frameTimes.length-1]-frameTimes[0])+"fps");
  lastFrameLength = getTime() - frameStartTime;
  isFrameDrawing = false;
}

function getSound(note,offset) {
  if (!note.additions) {
    note.additions = {};
  }
  if (note.additions.hitsound) {
   return "https://osu-beatmap-api.herokuapp.com/"+getID()+"/sounds/"+note.additions.hitsound.replace("wav","mp3");
  }
  var sampleIndex = '';
  var sampleType = note.additions.additionalSample || map.SampleSet.toLowerCase() || 'normal';
  var sound = note.soundTypes[0] || 'normal';
  var volume = 100;
  for(var i=0; i<map.timingPoints.length; i++) {
    var point = map.timingPoints[i];
    if (point.offset < offset) {
      sampleIndex = point.customSampleIndex || 0;
      volume = point.sampleVolume || 100;
      if (sampleIndex === 0 || sampleIndex === 1) {
        sampleIndex = '';
      }
    } else {
      break;
    }
  }
  volume = note.additions.hitsoundVolume || volume;
  return "https://osu-beatmap-api.herokuapp.com/"+getID()+"/sounds/"+sampleType+"-hit"+sound+sampleIndex+"$"+volume+".mp3";
}

function keyDown(event) {
  var key = event.key;
  var col = -1;
  var i;
  var timeOffset = getTime() - startTime;
  
  for (i=0; i<keys.length; i++) {
    if (keys[i] === key) {
      col = i;
      break;
    }
  }
  
  if (col === -1) {
    return;
  }
  
  for (i=0; i<map.hitObjects.length; i++) {
    var note = map.hitObjects[i];
    var targetCol = (note.position[0]-64)>>7;
    var timing = Math.abs(timeOffset-note.startTime);
    if (targetCol !== col) {
      continue;
    }
    
    var sound = getSound(note,note.startTime);
    //console.log(sound);
    try {
      playSound(sound);
    } catch (err) {
      console.log(sound + " isn't a sound");
    }
    
    if (timing > 158) {
      break;
    }
    var hitName = "Meh";
    var hitValue = 50;
    var hitBonusValue = 4;
    var hitBonus = -44;
    if (timing < 121) {
      hitName = "Ok";
      hitValue = 100;
      hitBonusValue = 8;
      hitBonus = -24;
    }
    if (timing < 97) {
      hitName = "Good";
      hitValue = 200;
      hitBonusValue = 16;
      hitBonus = -8;
    }
    if (timing < 67) {
      hitName = "Great";
      hitValue = 300;
      hitBonusValue = 32;
      hitBonus = 1;
    }
    if (timing < 34) {
      hitName = "Perfect";
      hitValue = 320;
      hitBonusValue = 32;
      hitBonus = 2;
    }
    bonus += hitBonus;
    if (bonus < 0) {
      bonus = 0;
    }
    if (bonus > 100) {
      bonus = 100;
    }
    var baseScore = (1000000 * 0.5 / map.nbCircles) * (hitValue / 320);
    var bonusScore = (1000000 * 0.5 / map.nbCircles) * (hitBonusValue * Math.sqrt(bonus) / 320);
    if (isNaN(bonusScore)) {
      bonusScore = 0;
    }
    grades[hitName]++;
    score += baseScore + bonusScore;
    map.hitObjects.splice(i,1);
    setText("score",Math.round(score));
    setText("lastHit",hitName);
    break;
  }
}

function showEndScreen() {
  gradeList.forEach(function (val) {
    setText(val+"Score",val+": "+grades[val]);
  });
  setText("score","0");
  setText("scoreScore","Score: "+Math.round(score));
  setText("titleScore",map.TitleUnicode+"\n"+map.Version);
  clearInterval(drawInt);
  setScreen("finalScore");
}

function getID() {
  var i = getProperty("songSelect","index");
  if (i === 0) {
    return getProperty("songID","text");
  }else{
    return mapListID[i];
  }
}

function getSong(){
  if (tries > 3) {
    setScreen("selection");
    console.log("Failed to load song.");
    return;
  }
  setScreen("loading");
  var id = getID();
  startWebRequest("https://osu-beatmap-api.herokuapp.com/"+id+"/maps", function(status, type, content) {
    try {
      maps = JSON.parse(content);
    } catch(err) {
      tries++;
      setTimeout(getSong,5000);
      return;
    }
    startMusic();
    setText("mapTitle",maps[0].TitleUnicode);
    maps = maps.filter(function(map){
      return map.Mode == 3 && map.CircleSize == 4;
    });
    var mapList = [];
    for(var i=0; i<maps.length; i++) {
      mapList.push(maps[i].Version);
    }
    if (maps.length === 0) {
      setText("mapTitle","This song doesn't appear to have any 4k mania maps. Please try another map");
    }
    setProperty("maps","options",mapList);
    setScreen("mapSelect");
  });
}

function startMusic() {
  var id = getID();
  playSound("https://osu-beatmap-api.herokuapp.com/"+id+"/song.mp3", false);
}

onEvent("submitB", "click", function() {
  tries = 0;
  getSong();
});

onEvent("playB", "click", function() {
  map = maps[getProperty("maps","index")];
  map.nbCircles = map.hitObjects.length;
  stopSound();
  startMusic();
  setScreen("gameScreen");
  startTime = getTime();
  noLongerNote = 0;
  score = 0;
  bonus = 100;
  grades = {"Perfect":0,"Great":0,"Good":0,"Ok":0,"Meh":0,"Miss":0};
  if (getProperty("shouldAuto","checked")) {
    var hits = [function(){keyDown({key:"d"})},function(){keyDown({key:"f"})},function(){keyDown({key:"j"})},function(){keyDown({key:"k"})}];
    for (var i=0; i<map.hitObjects.length; i++) {
      var object = map.hitObjects[i];
      var col = (object.position[0]-64)>>7;
      var offset = getTime() - startTime;
      setTimeout(hits[col],object.startTime-22-offset);
    }
  }
  drawInt = setInterval(draw,1000/frameRate);
  onEvent("gameScreen","keydown",keyDown);
});

onEvent("back", "click", function() {setScreen("selection")});
onEvent("back1", "click", function() {setScreen("selection"); stopSound()});
onEvent("back2", "click", function() {setScreen("selection"); stopSound()});
onEvent("faq", "click", function() {setScreen("howToPlay")});

keys.forEach(function(key) {
  onEvent(key+"Button","click", function() {keyDown({key:key})});
});