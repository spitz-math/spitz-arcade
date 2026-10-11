/* Spitz Arcade score codes.
   Every game shows one code on its end screen. The code holds the game, the question set and topics,
   the run length, the day, the score and correct/answered, sealed with a check that includes the
   student's name, so a code only checks out next to the name it was earned under.
   Old codes keep reading after layout changes (see LAYOUT_A / LAYOUT_B below).
   The teacher page (../teacher.html) reads codes with SpitzCode.read(code, name) and posts the checked top 10s
   to the student leaderboard (../leaderboard.html). Games never open a leaderboard themselves.

   Adding a game: give it the next unused id in GAMES, load this file on the page, and call
   SpitzCode.show(prefix, 'game_id', S) at the end of the end-screen function.
   S needs name, correct, answered, and score (or buds + rivals for a "versus" game, or strokes for golf).

   It stops copied, edited and shared codes. Someone who reads this file could still make a fake one. */
(function(){
'use strict';

var GAMES={                     /* id: [number in the code, display name, how it is ranked] — never renumber */
  splat_range:[1,'Splat Range','points'],
  star_swarm:[2,'Star Swarm','points'],
  shift_racer:[3,'Shift Racer','points'],
  jump_man_multiplication:[4,'Jump Man','points'],
  football_buds:[5,'Football Buds','versus'],
  hoop_buds:[6,'Hoop Buds','versus'],
  dash:[7,'Dash','points'],
  skate:[8,'Skate','points'],
  mini_golf:[9,'Mini Golf','points'],
  fishing:[10,'Go Fish','points'],
  brick_breaker:[11,'Brick Breaker','points'],
  burger_shop:[12,'Burger Shop','points'],
  burger_blaster:[13,'Burger Blaster','points'],
  rocket_buds:[14,'Rocket Buds','versus'],
  paint_royale:[15,'Paint Royale','points']
};
/* question sets in the order questions.js lists them; 0 means the game's own questions. Add new sets at the end.
   New codes have 4 bits for the set, so up to 15 sets fit. */
var SETS=[null,'mult','slope','point','hoy','shift','func','int','sq','plot0','plot','fam'];
var SET_NAMES={ mult:'Multiplication facts', slope:'Slope-intercept form', point:'Point-slope form', hoy:'HOY & VUX', shift:'Linear transformations', func:'Functions', int:'Integers', sq:'Squares & roots', plot0:'Graphing y = mx', plot:'Graphing y = mx + b', fam:'Function families' };
/* SET_TOPICS = topics on offer now. A topic's bit is its position, so never reorder; a dropped topic keeps its slot in TOPIC_NAMES
   (graphing's 'Plot it' and 'Points on the line', dropped Oct 10 2026) so older codes still name it. */
var SET_TOPICS={ mult:['f03','f46','f79','f1012'], slope:['write','slope','yint','graph'], point:['write','point','slope'], hoy:['describe','graph','slope'], shift:['vs','hs','gr','ne'], func:['points','table','map','graph'], int:['add','sub','mult'], sq:['square','root','neg','est'], plot0:['match','eq'], plot:['match','eq'], fam:['eq','graph'] };
var TOPIC_NAMES={ mult:['Facts 0–3','Facts 4–6','Facts 7–9','Facts 10–12'], slope:['Write the equation','Find the slope','Find the y-intercept','Read a graph'],
  point:['Write the equation','Find the point','Find the slope'], hoy:['Describe the line','Match the graph','Find the slope'], shift:['Vertical shifts','Horizontal shifts','Graphs','New equations'],
  func:['Ordered pairs','Tables','Mapping diagrams','Graphs'], int:['Adding','Subtracting','Multiplying'],
  sq:['Squaring','Square roots','Negatives','Estimating roots'],
  plot0:['Pick the line','Write the equation','Plot it','Points on the line'], plot:['Pick the line','Write the equation','Plot it','Points on the line'],
  fam:['From the equation','From the graph'] };

/* Google Form for score submissions. With only url, the button copies the code and opens the form.
   Add the entry.NNNN ids of the Name and Score code questions (from a pre-filled link) to fill both in for the student. */
var FORM={ url:'https://docs.google.com/forms/d/117PeTh-trNH6GQbGTRlyUHhxr6qat_FGoPFjKV_e3qY/viewform', name:'', code:'' };

var ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', SECRET='spitz|burger|arcade', BASE=Date.UTC(2026,7,1);
var MASK=BigInt('0xB4E1C93A5D7F02E68C1A');            /* 80 bits */
/* 64 payload bits + 16 check bits. The first 2 bits (ver) say the layout:
   ver 0 = layout B, made since Oct 10 2026 (4-bit set, 9-bit day); ver 1–3 = layout A, the first codes (3-bit set, 10-bit day). */
var ORDER=['ver','game','set','topics','len','day','score','correct','answered'];
var LAYOUT_A={ ver:2, game:5, set:3, topics:4, len:4, day:10, score:20, correct:8, answered:8 };
var LAYOUT_B={ ver:2, game:5, set:4, topics:4, len:4, day:9, score:20, correct:8, answered:8 };

function h32(s){ var h=2166136261; for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } h^=h>>>13; h=Math.imul(h,0x5bd1e995)>>>0; h^=h>>>15; return h>>>0; }
function normName(n){ return String(n||'').toLowerCase().replace(/[^a-z0-9]/g,''); }
/* salt 1–3 give the same code a different spelling, used to skip codes that spell something rude */
function check(P,name,salt){ return BigInt(h32(SECRET+(salt?'#'+salt:'')+'|'+P.toString(36)+'|'+normName(name))&0xFFFF); }
function stream(chk){ var a=BigInt(h32(SECRET+'a'+chk)), b=BigInt(h32(SECRET+'b'+chk)); return ((a<<32n)|b); }   /* 64 bits */
function clamp(v,bits){ v=Math.round(+v||0); return Math.max(0,Math.min(v,Math.pow(2,bits)-1)); }
function today(){ var d=new Date(); return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-BASE)/864e5); }

function pack(f,W){ var P=0n; ORDER.forEach(function(k){ P=(P<<BigInt(W[k]))|BigInt(clamp(f[k],W[k])); }); return P; }
function unpack(P,W){ var f={}; ORDER.slice().reverse().forEach(function(k){ var w=BigInt(W[k]); f[k]=Number(P&((1n<<w)-1n)); P>>=w; }); return f; }

function encode(f,name,salt){ var P=pack(f,LAYOUT_B), c=check(P,name,salt), full=(((P^stream(c))<<16n)|c)^MASK, s='';
  for(var i=0;i<16;i++){ s=ALPH[Number(full&31n)]+s; full>>=5n; } return s.slice(0,4)+'-'+s.slice(4,8)+'-'+s.slice(8,12)+'-'+s.slice(12); }

/* the hub link names the set and topics; no link means the game's own questions */
function linkSet(){ var q={}; try{ (location.search||'').replace(/^\?/,'').split('&').forEach(function(kv){ var p=kv.split('='); if(p[0]) q[p[0]]=decodeURIComponent(p[1]||''); }); }catch(e){}
  var set=SETS.indexOf(q.set); if(set<1) return {set:0,topics:0};
  var all=SET_TOPICS[q.set], want=(q.topics||'').split(','), m=0; all.forEach(function(t,i){ if(want.indexOf(t)>=0) m|=1<<i; });
  if(m===(1<<all.length)-1) m=0;                                     /* every topic = 0, same as none picked */
  return {set:set,topics:m}; }

var RUDE=/FUCK|FUK|FCK|CUNT|SHT|ASS|FAG|CUM|DCK|DICK|PUSS|PNS|PENS|TWAT|SLUT|WHR|NGA|NGR|NAZ|KKK|RAPE|SEX|SXY|XXX|TTS|TTY|CLT|DYKE|GAY|HTLR|PUTA|CRAP|DAMN|HELL|BUTT|PEE|POOP/;
function make(gameId,S){ var g=GAMES[gameId]; if(!g) throw new Error('Unknown game '+gameId); var L=linkSet(), score;
  if(g[2]==='versus') score=(clamp(S.buds,10)<<10)|clamp(S.rivals,10); else if(g[2]==='strokes') score=S.strokes; else score=S.score;
  var f={ ver:0, game:g[0], set:L.set, topics:L.topics, len:S.len||0, day:today()%(1<<LAYOUT_B.day), score:score, correct:S.correct, answered:S.answered }, code;
  for(var salt=0;salt<4;salt++){ code=encode(f,S.name,salt); if(!RUDE.test(code.replace(/-/g,''))) break; }
  return code; }

/* -> null if the code is malformed or does not belong to this name, else what the code holds */
function read(code,name){ var c=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,''); if(c.length!==16) return null;
  var full=0n; for(var i=0;i<16;i++){ var v=ALPH.indexOf(c[i]); if(v<0) return null; full=(full<<5n)|BigInt(v); }
  full^=MASK; var chk=full&0xFFFFn, P=(full>>16n)^stream(chk), ok=false;
  for(var salt=0;salt<4&&!ok;salt++) ok=check(P,name,salt)===chk; if(!ok) return null;
  var W=(P>>62n)===0n?LAYOUT_B:LAYOUT_A, f=unpack(P,W), id=null; Object.keys(GAMES).forEach(function(k){ if(GAMES[k][0]===f.game) id=k; });
  if(!id||f.set>=SETS.length||f.correct>f.answered) return null;
  var g=GAMES[id], set=SETS[f.set], r={ code:c.slice(0,4)+'-'+c.slice(4,8)+'-'+c.slice(8,12)+'-'+c.slice(12), game:id, gameName:g[1], kind:g[2],
    set:set||'', setName:set?SET_NAMES[set]:'Game’s own questions', topics:[], len:f.len, correct:f.correct, answered:f.answered };
  if(set){ var names=TOPIC_NAMES[set]; r.topics=f.topics? names.filter(function(n,i){ return f.topics&(1<<i); }) : names.slice(0,SET_TOPICS[set].length); r.allTopics=!f.topics; }
  var d=f.day, wrap=1<<W.day, now=today(); while(d+wrap<=now) d+=wrap; r.date=new Date(BASE+d*864e5); r.day=d;
  if(g[2]==='versus'){ r.buds=f.score>>10; r.rivals=f.score&1023; r.score=r.buds-r.rivals; r.display=r.buds+' – '+r.rivals; }
  else { r.score=f.score; r.display=f.score.toLocaleString(); }
  return r; }

/* ---------- end screen ---------- */
function css(){ if(document.getElementById('spz-code-css')) return; var st=document.createElement('style'); st.id='spz-code-css';
  st.textContent='.spz-code{ display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:10px 22px; margin:6px auto 14px; padding:14px 26px; max-width:1100px; border-radius:18px; background:var(--panel,#191C25); border:3px dashed var(--accent,#FFB020); }'+
  '.spz-code .l{ font:800 20px/1 var(--body,Inter,sans-serif); letter-spacing:.12em; text-transform:uppercase; color:var(--muted,#9AA3B8); }'+
  '.spz-code .v{ font:800 46px/1 ui-monospace,Menlo,Consolas,monospace; letter-spacing:.05em; color:var(--text,#fff); -webkit-user-select:all; user-select:all; }'+
  '.spz-code .n{ flex-basis:100%; text-align:center; font:600 20px/1.3 var(--body,Inter,sans-serif); color:var(--muted,#9AA3B8); }'+
  '.spz-code a,a.spz-send{ font:800 22px/1 var(--body,Inter,sans-serif); color:var(--paper,#0E1016); background:var(--accent,#FFB020); padding:12px 20px; border-radius:12px; text-decoration:none; } a.spz-send{ display:inline-block; margin-top:6px; }';
  document.head.appendChild(st); }
function prefilled(){ return !!(FORM.url&&FORM.name&&FORM.code); }
function formLink(name,code){ if(!FORM.url) return ''; if(!prefilled()) return FORM.url;
  return FORM.url+(FORM.url.indexOf('?')<0?'?':'&')+'usp=pp_url&'+FORM.name+'='+encodeURIComponent(name)+'&'+FORM.code+'='+encodeURIComponent(code); }
function button(link,code){ return '<a href="'+link+'" target="_blank" rel="noopener" data-spz-code="'+code+'">'+(prefilled()?'Send my score':'Copy code &amp; open form')+'</a>'; }
/* the leaderboard lives on the site, not in the games: hide any old in-game leaderboard button (Star Swarm's #sw-lbopen) */
(function(){ var st=document.createElement('style'); st.textContent='[id$="-lbopen"]{ display:none !important; }'; (document.head||document.documentElement).appendChild(st); })();
/* copy the code as the form opens, so the student can paste it */
document.addEventListener('click',function(e){ var a=e.target.closest&&e.target.closest('[data-spz-code]'); if(!a) return; var c=a.getAttribute('data-spz-code');
  try{ navigator.clipboard.writeText(c).then(function(){ a.textContent='Code copied ✓'; },function(){}); }catch(err){} },true);
function show(PFX,gameId,S){ try{
  var code=make(gameId,S), link=formLink(S.name,code), old=document.getElementById(PFX+'-endcode');
  css();
  if(old){ old.textContent=code; old.classList.add('spz-v'); var box=old.parentNode;
    if(link&&!box.querySelector('.spz-send')) box.insertAdjacentHTML('beforeend',button(link,code).replace('<a ','<a class="spz-send" '));
    return code; }
  var end=document.getElementById(PFX+'-end'); if(!end) return code;
  var el=end.querySelector('.spz-code');
  if(!el){ el=document.createElement('div'); el.className='spz-code'; var again=document.getElementById(PFX+'-again');
    if(again&&again.parentNode) again.parentNode.insertBefore(el,again); else (end.firstElementChild||end).appendChild(el); }
  el.innerHTML='<span class="l">Score code</span><span class="v">'+code+'</span>'+(link?button(link,code):'')+
    '<span class="n">'+(!link?'Type your name and this code into the class Google Form.':prefilled()?'Tap Send my score, then Submit on the form.':'Tap the button, then paste the code into the form with your name.')+'</span>';
  return code; }catch(e){ return ''; } }

window.SpitzCode={ GAMES:GAMES, SET_NAMES:SET_NAMES, TOPIC_NAMES:TOPIC_NAMES, make:make, read:read, show:show, normName:normName, today:today, FORM:FORM };
})();
