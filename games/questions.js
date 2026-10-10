/* Spitz Arcade shared question sets.
   Every solo game loads this file. A game asks SpitzQ.forGame(prefix) for its questions,
   and the hub link picks the set and topics:  game.html?set=slope&topics=write,yint
   Each set below is the exact generator code from the game it came from (Hoop Buds, Splat Range,
   Shift Racer), so every answer is still checked independently before it is shown. */
(function(){
'use strict';

function makeMult(PFX){
  var MINUS='−';
  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a; }
  function R(n,d){ if(d<0){ n=-n; d=-d; } var g=gcd(n,d)||1; return {n:n/g,d:d/g}; }
  function ri(a,b){ return a+Math.floor(Math.random()*(b-a+1)); }
  function nz(a,b){ var v; do{ v=ri(a,b); }while(v===0); return v; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function num(n){ return n<0? MINUS+(-n) : ''+n; }
  function frac(n,d){ return '<span class="'+PFX+'-fr"><span>'+n+'</span><span>'+d+'</span></span>'; }
  function fmtR(r){ if(r.d===1) return num(r.n); return (r.n<0?MINUS:'')+frac(Math.abs(r.n),r.d); }
  function coef(r,v){ if(r.d===1&&r.n===1) return v; if(r.d===1&&r.n===-1) return MINUS+v; return fmtR(r)+v; }
  function pt(x,y){ return '('+num(x)+', '+num(y)+')'; }
  function sgn(v){ return v>0? ' + '+v : v<0? ' '+MINUS+' '+(-v) : ''; }
  function psStr(m,h,k){ var c=(m.d===1&&m.n===1)?'':(m.d===1&&m.n===-1)?MINUS:fmtR(m); return 'y'+sgn(-k)+' = '+c+'(x'+sgn(-h)+')'; }
  function siStr(m,b){ return 'y = '+coef(m,'x')+sgn(b); }
  function stdNorm(A,B,C){ var g=gcd(gcd(A,B),C)||1; A/=g; B/=g; C/=g; if(A<0||(A===0&&B<0)){ A=-A; B=-B; C=-C; } return {A:A,B:B,C:C}; }
  function stdStr(L){ var a=L.A===1?'x':L.A===-1?MINUS+'x':num(L.A)+'x';
    var b=L.B===1?' + y':L.B===-1?' '+MINUS+' y':L.B>0?' + '+L.B+'y':' '+MINUS+' '+(-L.B)+'y'; return a+b+' = '+num(L.C); }
  function linePS(m,h,k){ return {A:-m.n,B:m.d,C:m.d*k-m.n*h}; }          // y-k=m(x-h)  ->  -p x + q y = qk - ph
  function lineSI(m,b){ return {A:-m.n,B:m.d,C:m.d*b}; }
  function sameLine(a,b){ return a.A*b.B===b.A*a.B && a.A*b.C===b.A*a.C && a.B*b.C===b.B*a.C; }
  function onLine(L,x,y){ return L.A*x+L.B*y===L.C; }
  function eq(h){ return '<span class="'+PFX+'-eq">'+h+'</span>'; }
  function M(r){ return '<span class="c-m">'+fmtR(r)+'</span>'; }
  function P(x,y){ return '<span class="c-pt">'+pt(x,y)+'</span>'; }
  var SLOPES=[2,-2,3,-3,4,-4,5,-5].map(function(n){ return R(n,1); }).concat(
    [[1,2],[-1,2],[1,3],[-1,3],[2,3],[-2,3],[3,2],[-3,2],[3,4],[-3,4]].map(function(a){ return R(a[0],a[1]); }));
  function C(html,val,why){ return {html:html,val:val,why:why||'',key:html}; }
  function rEq(a,b){ return a.n*b.d===b.n*a.d; }
  function siRev(m,b){ var a=R(Math.abs(m.n),m.d); return 'y = '+num(b)+(m.n>0?' + ':' '+MINUS+' ')+coef(a,'x'); }   // y = 4 − 3x
  function B(v){ return '<span class="c-b">'+v+'</span>'; }
  
  /* ================= QUESTION GENERATOR: multiplication facts 0–12 =================
     Facts are grouped by their smaller factor, so the end screen shows which tables need work. */
  var GROUPS={ 'Facts 0–3':[0,3], 'Facts 4–6':[4,6], 'Facts 7–9':[7,9], 'Facts 10–12':[10,12] };
  function fact(a,b){ return a+' × '+b; }
  function mulQ(topic){ var g=GROUPS[topic], s=ri(g[0],g[1]), o=ri(s,12), flip=Math.random()<0.5, a=flip?o:s, b=flip?s:o, ans=a*b;
    var near=[[a*(b+1),'That is '+fact(a,b+1)+'.'],[(a+1)*b,'That is '+fact(a+1,b)+'.']]; if(b>0) near.push([a*(b-1),'That is '+fact(a,b-1)+'.']); if(a>0) near.push([(a-1)*b,'That is '+fact(a-1,b)+'.']);
    near.sort(function(){ return Math.random()-0.5; });
    var special=a===0||b===0||a===1||b===1, addWhy=(a===0||b===0)?'Anything times 0 is 0.':(a===1||b===1)?'Anything times 1 stays the same.':'You added. '+fact(a,b)+' means '+a+' groups of '+b+'.';
    var cand=(special||Math.random()<0.5)? [[a+b,addWhy]].concat(near) : near.concat([[a+b,addWhy]]), skip='Skip-count by '+Math.max(a,b)+', '+Math.min(a,b)+' times.';
    cand=cand.concat([[ans+10,skip],[ans+2,skip],[ans+1,skip],[ans+3,skip]]);
    var ch=[C(''+ans,ans)], seen={}; seen[ans]=1; cand.forEach(function(c){ if(ch.length<4&&c[0]>=0&&!seen[c[0]]){ seen[c[0]]=1; ch.push(C(''+c[0],c[0],c[1])); } });
    return { topic:topic, prompt:eq(fact(a,b)+' = ?'), data:{a:a,b:b}, choices:ch, explain:eq(fact(a,b)+' = <span class="c-ans">'+ans+'</span>'),
      check:function(v){ var t=0; for(var i=0;i<a;i++) t+=b; return v===t; } }; }                      /* repeated addition, separate from a*b */
  var GEN={}; Object.keys(GROUPS).forEach(function(t){ GEN[t]=function(){ return mulQ(t); }; });
  var BAG=['Facts 0–3','Facts 4–6','Facts 4–6','Facts 7–9','Facts 7–9','Facts 7–9','Facts 10–12','Facts 10–12'];
  function build(type){ for(var tries=0;tries<400;tries++){ var q=GEN[type](); if(!q||q.choices.length!==4) continue;
      if(!q.check(q.choices[0].val)) continue;                                                  // the answer must pass the independent check
      if(q.choices.slice(1).some(function(c){ return q.check(c.val); })) continue;              // and no distractor may pass it
      q.type=type; q.choices.forEach(function(c,i){ c.ok=i===0; }); q.choices.sort(function(x,y){ return x.val-y.val; });   // smallest to largest, quick to scan
      q.visual=''; delete q.check; return q; } throw new Error('generator failed: '+type); }
  var topicBag=[], lastFact='';
  return { build:build }; }

function makeLinear(PFX){
  var MINUS='−';
  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a; }
  function R(n,d){ if(d<0){ n=-n; d=-d; } var g=gcd(n,d)||1; return {n:n/g,d:d/g}; }
  function ri(a,b){ return a+Math.floor(Math.random()*(b-a+1)); }
  function nz(a,b){ var v; do{ v=ri(a,b); }while(v===0); return v; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function num(n){ return n<0? MINUS+(-n) : ''+n; }
  function frac(n,d){ return '<span class="'+PFX+'-fr"><span>'+n+'</span><span>'+d+'</span></span>'; }
  function fmtR(r){ if(r.d===1) return num(r.n); return (r.n<0?MINUS:'')+frac(Math.abs(r.n),r.d); }
  function coef(r,v){ if(r.d===1&&r.n===1) return v; if(r.d===1&&r.n===-1) return MINUS+v; return fmtR(r)+v; }
  function pt(x,y){ return '('+num(x)+', '+num(y)+')'; }
  function sgn(v){ return v>0? ' + '+v : v<0? ' '+MINUS+' '+(-v) : ''; }
  function psStr(m,h,k){ var c=(m.d===1&&m.n===1)?'':(m.d===1&&m.n===-1)?MINUS:fmtR(m); return 'y'+sgn(-k)+' = '+c+'(x'+sgn(-h)+')'; }
  function siStr(m,b){ return 'y = '+coef(m,'x')+sgn(b); }
  function stdNorm(A,B,C){ var g=gcd(gcd(A,B),C)||1; A/=g; B/=g; C/=g; if(A<0||(A===0&&B<0)){ A=-A; B=-B; C=-C; } return {A:A,B:B,C:C}; }
  function stdStr(L){ var a=L.A===1?'x':L.A===-1?MINUS+'x':num(L.A)+'x';
    var b=L.B===1?' + y':L.B===-1?' '+MINUS+' y':L.B>0?' + '+L.B+'y':' '+MINUS+' '+(-L.B)+'y'; return a+b+' = '+num(L.C); }
  function linePS(m,h,k){ return {A:-m.n,B:m.d,C:m.d*k-m.n*h}; }          // y-k=m(x-h)  ->  -p x + q y = qk - ph
  function lineSI(m,b){ return {A:-m.n,B:m.d,C:m.d*b}; }
  function sameLine(a,b){ return a.A*b.B===b.A*a.B && a.A*b.C===b.A*a.C && a.B*b.C===b.B*a.C; }
  function onLine(L,x,y){ return L.A*x+L.B*y===L.C; }
  function eq(h){ return '<span class="'+PFX+'-eq">'+h+'</span>'; }
  function M(r){ return '<span class="c-m">'+fmtR(r)+'</span>'; }
  function P(x,y){ return '<span class="c-pt">'+pt(x,y)+'</span>'; }
  var SLOPES=[2,-2,3,-3,4,-4,5,-5].map(function(n){ return R(n,1); }).concat(
    [[1,2],[-1,2],[1,3],[-1,3],[2,3],[-2,3],[3,2],[-3,2],[3,4],[-3,4]].map(function(a){ return R(a[0],a[1]); }));
  function C(html,val,why){ return {html:html,val:val,why:why||'',key:html}; }
  function rEq(a,b){ return a.n*b.d===b.n*a.d; }
  function siRev(m,b){ var a=R(Math.abs(m.n),m.d); return 'y = '+num(b)+(m.n>0?' + ':' '+MINUS+' ')+coef(a,'x'); }   // y = 4 − 3x
  function B(v){ return '<span class="c-b">'+v+'</span>'; }
  
  /* graph: window −6..6, red line (lesson color), lemon dots for marked points */
  function graphSVG(g){ var S=380, u=S/12, X=function(x){ return ((x+6)*u).toFixed(1); }, Y=function(y){ return ((6-y)*u).toFixed(1); }, h='';
    for(var i=-6;i<=6;i++){ h+='<line x1="'+X(i)+'" y1="0" x2="'+X(i)+'" y2="'+S+'" stroke="#2A3142" stroke-width="2"/><line x1="0" y1="'+Y(i)+'" x2="'+S+'" y2="'+Y(i)+'" stroke="#2A3142" stroke-width="2"/>'; }
    h+='<line x1="0" y1="'+Y(0)+'" x2="'+S+'" y2="'+Y(0)+'" stroke="#C9D1E0" stroke-width="3"/><line x1="'+X(0)+'" y1="0" x2="'+X(0)+'" y2="'+S+'" stroke="#C9D1E0" stroke-width="3"/>';
    [-4,-2,2,4].forEach(function(n){ h+='<text x="'+X(n)+'" y="'+(+Y(0)+24)+'" text-anchor="middle" font-size="20" font-weight="800" fill="#9BA5B8" font-family="Inter,sans-serif">'+num(n)+'</text>'+
      '<text x="'+(+X(0)-8)+'" y="'+(+Y(n)+7)+'" text-anchor="end" font-size="20" font-weight="800" fill="#9BA5B8" font-family="Inter,sans-serif">'+num(n)+'</text>'; });
    h+='<text x="'+(S-8)+'" y="'+(+Y(0)-10)+'" text-anchor="end" font-size="22" font-weight="800" fill="#C9D1E0" font-family="Inter,sans-serif">x</text><text x="'+(+X(0)+10)+'" y="22" font-size="22" font-weight="800" fill="#C9D1E0" font-family="Inter,sans-serif">y</text>';
    var x1,y1,x2,y2;
    if(g.h!==undefined){ x1=-7; x2=7; y1=y2=g.h; } else if(g.v!==undefined){ y1=-7; y2=7; x1=x2=g.v; }
    else { x1=-7; x2=7; y1=g.b+g.m.n*x1/g.m.d; y2=g.b+g.m.n*x2/g.m.d; }
    h+='<line x1="'+X(x1)+'" y1="'+Y(y1)+'" x2="'+X(x2)+'" y2="'+Y(y2)+'" stroke="#FF4B4B" stroke-width="6" stroke-linecap="round"/>';
    (g.dots||[]).forEach(function(p){ h+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="9" fill="#FFF04D" stroke="#0E1016" stroke-width="3"/>'; });
    return '<svg class="'+PFX+'-graph" width="'+S+'" height="'+S+'" viewBox="0 0 '+S+' '+S+'" role="img" aria-label="Graph of a line">'+h+'</svg>'; }
  
  /* ================= QUESTION GENERATORS =================
     Each returns {topic,prompt,visual,choices[0]=correct,explain,data,check}. check(val) is an independent
     test of whether a choice is right; the build step rejects any question where a distractor also passes. */
  var GEN={
  siSlope:function(){ var m=pick(SLOPES), b=nz(-9,9), rev=Math.random()<0.3, e=rev?siRev(m,b):siStr(m,b);
    return { topic:'Slope-intercept form', prompt:'What is the <span class="c-m">slope</span> of '+eq(e)+'?', data:{m:m,b:b},
      check:function(v){ return v.n!==undefined && rEq(v,R((b+m.n)-b,m.d)); },        /* rise from (0,b) to (d, b+n) over run d */
      choices:[ C(fmtR(m),m), C(num(b),R(b,1),'That is b, the y-intercept. The slope is the number multiplied by x.'),
        C(fmtR(R(-m.n,m.d)),R(-m.n,m.d),'Keep the sign in front of x: it is '+(m.n>0?'+':MINUS)+', so the slope is '+(m.n>0?'positive':'negative')+'.'),
        C(fmtR(R(m.d,m.n)),R(m.d,m.n),'Don’t flip it. The slope is the x-coefficient exactly as written.') ],
      explain:'In y = mx + b, the slope m is the number with x: '+M(m)+'.' }; },
  siYInt:function(){ var m=pick(SLOPES), b=nz(-9,9), rev=Math.random()<0.3, e=rev?siRev(m,b):siStr(m,b); if(Math.abs(b)===Math.abs(m.n)&&m.d===1) return null;
    return { topic:'Slope-intercept form', prompt:'What is the <span class="c-b">y-intercept</span> of '+eq(e)+'?', data:{m:m,b:b},
      check:function(v){ return v.n!==undefined && rEq(v,R(m.n*0+b*m.d,m.d)); },      /* y when x = 0 */
      choices:[ C(num(b),R(b,1)), C(fmtR(m),m,'That is the slope, m. The y-intercept is b, the number without x.'),
        C(num(-b),R(-b,1),'Keep b’s sign: '+eq(e)+' has b = '+num(b)+'.'),
        C(fmtR(R(-m.n,m.d)),R(-m.n,m.d),'That comes from the slope. The y-intercept is the constant, the number without x.') ],
      explain:'In y = mx + b, b is the number without x. The y-intercept is '+B(num(b))+', the point '+P(0,b)+'.' }; },
  siBuild:function(){ var m=pick(SLOPES), b=nz(-9,9); if(m.d===1&&Math.abs(m.n)===Math.abs(b)) return null;
    var bad1=m.d===1? siStr(R(b,1),m.n) : null; if(!bad1) return null;
    return { topic:'Slope-intercept form', prompt:'Which line has slope '+M(m)+' and y-intercept '+B(num(b))+'?', data:{m:m,b:b},
      check:function(v){ return v.A!==undefined && onLine(v,0,b) && onLine(v,m.d,b+m.n); },
      choices:[ C(siStr(m,b),lineSI(m,b)), C(bad1,lineSI(R(b,1),m.n),'Swapped. The slope goes with x and the y-intercept stands alone: y = mx + b.'),
        C(siStr(m,-b),lineSI(m,-b),'Check b’s sign: the y-intercept is '+num(b)+'.'),
        C(siStr(R(-m.n,m.d),b),lineSI(R(-m.n,m.d),b),'Check the slope’s sign: it is '+num(m.n)+'.') ],
      explain:'Put m with x and b by itself: '+eq(siStr(m,b))+'.' }; },
  graphSlope:function(){ var a=nz(-5,5), b=nz(-5,5); if(Math.abs(a)===Math.abs(b)) return null; var m=R(b,-a);
    return { topic:'Graphs', prompt:'What is the <span class="c-m">slope</span> of the line?', visual:graphSVG({m:m,b:b,dots:[[a,0],[0,b]]}), data:{a:a,b:b},
      check:function(v){ return v.n!==undefined && rEq(v,R(b-0,0-a)); },
      choices:[ C(fmtR(m),m), C(fmtR(R(-m.n,m.d)),R(-m.n,m.d),m.n>0?'The line goes uphill left to right, so the slope is positive.':'The line goes downhill left to right, so the slope is negative.'),
        C(fmtR(R(m.d,m.n)),R(m.d,m.n),'That is run over rise. Count up or down first (rise), then over (run).'),
        C(fmtR(R(-m.d,m.n)),R(-m.d,m.n),'Flipped and the wrong sign. Rise over run, and check uphill or downhill.') ],
      explain:'From one dot to the other: rise '+num(Math.abs(b)*(m.n>0?1:-1))+', run '+Math.abs(a)+'. Slope = '+M(m)+'.' }; },
  graphYInt:function(){ var a=nz(-5,5), b=nz(-5,5); if(Math.abs(a)===Math.abs(b)) return null; var m=R(b,-a), L=lineSI(m,b);
    return { topic:'Graphs', prompt:'What is the <span class="c-b">y-intercept</span>?', visual:graphSVG({m:m,b:b}), data:{a:a,b:b},
      check:function(v){ return v.x===0 && onLine(L,v.x,v.y); },
      choices:[ C(pt(0,b),{x:0,y:b}), C(pt(b,0),{x:b,y:0},'That point is on the x-axis. The y-intercept is where the line crosses the y-axis: (0, y).'),
        C(pt(0,-b),{x:0,y:-b},'Check the sign: the line crosses the y-axis '+(b>0?'above':'below')+' the origin.'),
        C(pt(a,0),{x:a,y:0},'That is where the line crosses the x-axis, the x-intercept.') ],
      explain:'The line crosses the y-axis at '+B(pt(0,b))+'.' }; },
  graphXInt:function(){ var a=nz(-5,5), b=nz(-5,5); if(Math.abs(a)===Math.abs(b)) return null; var m=R(b,-a), L=lineSI(m,b);
    return { topic:'Graphs', prompt:'What is the <span class="c-x">x-intercept</span>?', visual:graphSVG({m:m,b:b}), data:{a:a,b:b},
      check:function(v){ return v.y===0 && onLine(L,v.x,v.y); },
      choices:[ C(pt(a,0),{x:a,y:0}), C(pt(0,a),{x:0,y:a},'That point is on the y-axis. The x-intercept is where the line crosses the x-axis: (x, 0).'),
        C(pt(-a,0),{x:-a,y:0},'Check the sign: the line crosses the x-axis '+(a>0?'right':'left')+' of the origin.'),
        C(pt(0,b),{x:0,y:b},'That is where the line crosses the y-axis, the y-intercept.') ],
      explain:'The line crosses the x-axis at <span class="c-x">'+pt(a,0)+'</span>.' }; },
  hvType:function(){ var hz=Math.random()<0.5, c=nz(-9,9), e=(hz?'y':'x')+' = '+num(c);
    var HOY='HOY: y = a number is Horizontal with 0 slope.', VUX='VUX: x = a number is Vertical with Undefined slope.';
    var opts=[['Horizontal, slope 0','H0'],['Vertical, undefined slope','VU'],['Horizontal, undefined slope','HU'],['Vertical, slope 0','V0']];
    var why=hz? {VU:'That is VUX. '+HOY, HU:'Right direction, wrong slope. '+HOY, V0:'Right slope, wrong direction. '+HOY}
              : {H0:'That is HOY. '+VUX, V0:'Right direction, wrong slope. '+VUX, HU:'Right slope, wrong direction. '+VUX};
    var ok=hz?'H0':'VU', ch=[C(opts.filter(function(o){ return o[1]===ok; })[0][0],{hv:ok})];
    opts.forEach(function(o){ if(o[1]!==ok) ch.push(C(o[0],{hv:o[1]},why[o[1]])); });
    return { topic:'HOY & VUX', prompt:'Describe the line '+eq(e)+'.', data:{hz:hz}, check:function(v){ return v.hv===(e.charAt(0)==='y'?'H0':'VU'); }, choices:ch,
      explain: hz? HOY.replace('HOY:','<b>HOY</b>:') : VUX.replace('VUX:','<b>VUX</b>:') }; },
  hvGraph:function(){ var hz=Math.random()<0.5, c=nz(-5,5), v=hz?'y':'x', o=hz?'x':'y';
    return { topic:'HOY & VUX', prompt:'Which equation matches the line?', visual:graphSVG(hz?{h:c}:{v:c}), data:{hz:hz,c:c},
      check:function(val){ return val.e===(hz?'y':'x') && val.c===c && !val.s; },
      choices:[ C(v+' = '+num(c),{e:v,c:c}), C(o+' = '+num(c),{e:o,c:c},hz?'x = a number is a vertical line (VUX). This line is horizontal: y = a number.':'y = a number is a horizontal line (HOY). This line is vertical: x = a number.'),
        C(v+' = '+num(-c),{e:v,c:-c},'Check the sign: the line is '+(hz?(c>0?'above':'below')+' the x-axis':(c>0?'right':'left')+' of the y-axis')+'.'),
        C('y = '+coef(R(c,1),'x'),{e:'y',c:c,s:1},'y = '+coef(R(c,1),'x')+' is slanted. A '+(hz?'horizontal line has no x-term: y = a number.':'vertical line is x = a number.')) ],
      explain: hz? '<b>HOY</b>: a horizontal line is y = a number. Every point has y = '+num(c)+', so '+eq('y = '+num(c))+'.' : '<b>VUX</b>: a vertical line is x = a number. Every point has x = '+num(c)+', so '+eq('x = '+num(c))+'.' }; },
  psWrite:function(){ var m=pick(SLOPES), h=nz(-9,9), k=nz(-9,9); if(Math.abs(h)===Math.abs(k)) return null;
    return { topic:'Point-slope form', prompt:'Write the line through '+P(h,k)+' with slope '+M(m)+' in point-slope form.', data:{m:m,h:h,k:k},
      check:function(v){ return v.A!==undefined && onLine(v,h,k) && onLine(v,h+m.d,k+m.n); },
      choices:[ C(psStr(m,h,k),linePS(m,h,k)), C(psStr(m,-h,-k),linePS(m,-h,-k),'Both signs flipped. The form subtracts the point: y − y₁ = m(x − x₁).'),
        C(psStr(m,k,h),linePS(m,k,h),'x and y are swapped. The x-coordinate goes with x and the y-coordinate goes with y.'),
        C(psStr(m,-h,k),linePS(m,-h,k),'The x sign is flipped. x − ('+num(h)+') becomes x'+sgn(-h)+'.') ],
      explain:'y − y₁ = m(x − x₁) with x₁ = '+num(h)+' and y₁ = '+num(k)+': '+eq(psStr(m,h,k))+'.' }; },
  psPoint:function(){ var m=pick(SLOPES), h=nz(-9,9), k=nz(-9,9); if(Math.abs(h)===Math.abs(k)) return null; var L=linePS(m,h,k);
    return { topic:'Point-slope form', prompt:'What <span class="c-pt">point</span> does '+eq(psStr(m,h,k))+' use?', data:{m:m,h:h,k:k},
      check:function(v){ return v.x===h && v.y===k && onLine(L,v.x,v.y); },
      choices:[ C(pt(h,k),{x:h,y:k}), C(pt(-h,-k),{x:-h,y:-k},'Those are the numbers with the signs as written. The form subtracts, so switch both signs.'),
        C(pt(-h,k),{x:-h,y:k},'Switch the x sign too: x'+sgn(-h)+' means x₁ = '+num(h)+'.'),
        C(pt(h,-k),{x:h,y:-k},'Switch the y sign too: y'+sgn(-k)+' means y₁ = '+num(k)+'.') ],
      explain:'y − y₁ = m(x − x₁): switch the signs you see. The point is '+P(h,k)+'.' }; },
  psSlope:function(){ var m=pick(SLOPES), h=nz(-9,9), k=nz(-9,9); if(Math.abs(h)===Math.abs(k)) return null;
    return { topic:'Point-slope form', prompt:'What is the <span class="c-m">slope</span> of '+eq(psStr(m,h,k))+'?', data:{m:m,h:h,k:k},
      check:function(v){ return v.n!==undefined && rEq(v,R((k+m.n)-k,(h+m.d)-h)); },
      choices:[ C(fmtR(m),m), C(fmtR(R(-m.n,m.d)),R(-m.n,m.d),'Keep the sign in front of the parentheses: the slope is '+(m.n>0?'positive':'negative')+'.'),
        C(num(k),R(k,1),'That is y₁, part of the point. The slope is the number in front of the parentheses.'),
        C(num(-h),R(-h,1),'That number is inside the parentheses, so it belongs to the point. The slope is in front.') ],
      explain:'In y − y₁ = m(x − x₁), the slope m is the number in front of the parentheses: '+M(m)+'.' }; },
  slopeHV:function(){ var hz=Math.random()<0.5, c=nz(-9,9); if(Math.abs(c)===1) return null;
    var z=C('0',{hv:'0'}, 'This line is vertical. VUX: Vertical, Undefined slope, X = a number.'),
        u=C('Undefined',{hv:'u'},'This line is horizontal. HOY: Horizontal, 0 slope, Y = a number.'),
        n=C(num(c),{hv:'c'},'The '+num(c)+' tells where the line crosses the '+(hz?'y':'x')+'-axis, not its slope.'),
        o=C('1',{hv:'1'},'There is no x-term to give a slope of 1. Use '+(hz?'HOY':'VUX')+'.');
    return { topic:'HOY & VUX', prompt:'What is the <span class="c-m">slope</span> of '+eq((hz?'y':'x')+' = '+num(c))+'?', data:{hz:hz},
      check:function(v){ return v.hv===(hz?'0':'u'); },
      choices: hz? [C('0',{hv:'0'}),u,n,o] : [C('Undefined',{hv:'u'}),z,n,o],
      explain: hz? '<b>HOY</b>: Horizontal, 0 slope, Y = a number. The slope is <span class="c-m">0</span>.' : '<b>VUX</b>: Vertical, Undefined slope, X = a number. The slope is <span class="c-m">undefined</span>.' }; }
  };
  var TOPICS={ 'Slope-intercept form':['siSlope','siSlope','siYInt','siYInt','siBuild'], 'Point-slope form':['psWrite','psPoint','psSlope'], 'Graphs':['graphSlope','graphYInt','graphXInt'], 'HOY & VUX':['hvType','hvGraph','slopeHV'] };
  var BAG=['Slope-intercept form','Slope-intercept form','Point-slope form','Point-slope form','Graphs','Graphs','HOY & VUX'];
  function build(type){ for(var tries=0;tries<300;tries++){ var q=GEN[type](); if(!q) continue;
      var keys=q.choices.map(function(c){ return c.key; }); if(new Set(keys).size!==4) continue;
      if(!q.check(q.choices[0].val)) continue;                                                  // the answer must pass the independent check
      if(q.choices.slice(1).some(function(c){ return q.check(c.val); })) continue;              // and no distractor may pass it
      q.type=type; q.choices.forEach(function(c,i){ c.ok=i===0; });
      for(var i=3;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=q.choices[i]; q.choices[i]=q.choices[j]; q.choices[j]=t; }
      q.visual=q.visual||''; delete q.check; return q; } throw new Error('generator failed: '+type); }
  var topicBag=[], lastType='';
  return { build:build }; }

function makeShift(PFX){
  var MINUS='−';
  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a; }
  function R(n,d){ if(d<0){ n=-n; d=-d; } var g=gcd(n,d)||1; return {n:n/g,d:d/g}; }
  function ri(a,b){ return a+Math.floor(Math.random()*(b-a+1)); }
  function nz(a,b){ var v; do{ v=ri(a,b); }while(v===0); return v; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function num(n){ return n<0? MINUS+(-n) : ''+n; }
  function frac(n,d){ return '<span class="'+PFX+'-fr"><span>'+n+'</span><span>'+d+'</span></span>'; }
  function fmtR(r){ if(r.d===1) return num(r.n); return (r.n<0?MINUS:'')+frac(Math.abs(r.n),r.d); }
  function coef(r,v){ if(r.d===1&&r.n===1) return v; if(r.d===1&&r.n===-1) return MINUS+v; return fmtR(r)+v; }
  function pt(x,y){ return '('+num(x)+', '+num(y)+')'; }
  function sgn(v){ return v>0? ' + '+v : v<0? ' '+MINUS+' '+(-v) : ''; }
  function psStr(m,h,k){ var c=(m.d===1&&m.n===1)?'':(m.d===1&&m.n===-1)?MINUS:fmtR(m); return 'y'+sgn(-k)+' = '+c+'(x'+sgn(-h)+')'; }
  function siStr(m,b){ return 'y = '+coef(m,'x')+sgn(b); }
  function stdNorm(A,B,C){ var g=gcd(gcd(A,B),C)||1; A/=g; B/=g; C/=g; if(A<0||(A===0&&B<0)){ A=-A; B=-B; C=-C; } return {A:A,B:B,C:C}; }
  function stdStr(L){ var a=L.A===1?'x':L.A===-1?MINUS+'x':num(L.A)+'x';
    var b=L.B===1?' + y':L.B===-1?' '+MINUS+' y':L.B>0?' + '+L.B+'y':' '+MINUS+' '+(-L.B)+'y'; return a+b+' = '+num(L.C); }
  function linePS(m,h,k){ return {A:-m.n,B:m.d,C:m.d*k-m.n*h}; }          // y-k=m(x-h)  ->  -p x + q y = qk - ph
  function lineSI(m,b){ return {A:-m.n,B:m.d,C:m.d*b}; }
  function sameLine(a,b){ return a.A*b.B===b.A*a.B && a.A*b.C===b.A*a.C && a.B*b.C===b.B*a.C; }
  function onLine(L,x,y){ return L.A*x+L.B*y===L.C; }
  function eq(h){ return '<span class="'+PFX+'-eq">'+h+'</span>'; }
  function M(r){ return '<span class="c-m">'+fmtR(r)+'</span>'; }
  function P(x,y){ return '<span class="c-pt">'+pt(x,y)+'</span>'; }
  var SLOPES=[2,-2,3,-3,4,-4,5,-5].map(function(n){ return R(n,1); }).concat(
    [[1,2],[-1,2],[1,3],[-1,3],[2,3],[-2,3],[3,2],[-3,2],[3,4],[-3,4]].map(function(a){ return R(a[0],a[1]); }));
  function C(html,val,why){ return {html:html,val:val,why:why||'',key:html}; }
  function rEq(a,b){ return a.n*b.d===b.n*a.d; }
  function siRev(m,b){ var a=R(Math.abs(m.n),m.d); return 'y = '+num(b)+(m.n>0?' + ':' '+MINUS+' ')+coef(a,'x'); }   // y = 4 − 3x
  function B(v){ return '<span class="c-b">'+v+'</span>'; }
  
  /* translation helpers */
  var W_OUT='The number is outside the parentheses, so the graph moves up or down.';
  var W_IN='The number is inside with x, so the graph moves left or right.';
  function fnot(dx,dy){ return 'f(x'+sgn(-dx)+')'+sgn(dy); }                               // f(x − 3) + 4
  function dirStr(dx,dy){ var k=Math.abs(dx||dy); return (dx?(dx>0?'Right ':'Left '):(dy>0?'Up ':'Down '))+k+(k===1?' unit':' units'); }
  function low(s){ return s.charAt(0).toLowerCase()+s.slice(1); }
  function CD(dx,dy,why){ return C(dirStr(dx,dy),{dx:dx,dy:dy},why); }
  function CN(dx,dy,why,bare){ return C((bare?'':'g(x) = ')+fnot(dx,dy),{dx:dx,dy:dy},why); }
  function fx(n,m,b){ return n+'(x) = '+coef(m,'x')+sgn(b); }
  function CL(m,b,why){ return C(fx('g',m,b),lineSI(m,b),why); }
  function moved(m,px,py,dx,dy){ return linePS(m,px+dx,py+dy); }                            // the line through (px,py) with slope m, slid by (dx,dy)
  var GS=[R(2,1),R(-2,1),R(3,1),R(-3,1),R(1,2),R(-1,2)];
  
  /* graph: window −6..6. f is dashed gray, g is the red line (lesson color). Each line = {m,px,py}. */
  function graphSVG(f,g,dots,dotCol){ var S=380, u=S/12, X=function(x){ return ((x+6)*u).toFixed(1); }, Y=function(y){ return ((6-y)*u).toFixed(1); }, h='';
    for(var i=-6;i<=6;i++){ h+='<line x1="'+X(i)+'" y1="0" x2="'+X(i)+'" y2="'+S+'" stroke="#2A3142" stroke-width="2"/><line x1="0" y1="'+Y(i)+'" x2="'+S+'" y2="'+Y(i)+'" stroke="#2A3142" stroke-width="2"/>'; }
    h+='<line x1="0" y1="'+Y(0)+'" x2="'+S+'" y2="'+Y(0)+'" stroke="#C9D1E0" stroke-width="3"/><line x1="'+X(0)+'" y1="0" x2="'+X(0)+'" y2="'+S+'" stroke="#C9D1E0" stroke-width="3"/>';
    [-4,-2,2,4].forEach(function(n){ h+='<text x="'+X(n)+'" y="'+(+Y(0)+24)+'" text-anchor="middle" font-size="20" font-weight="800" fill="#9BA5B8" font-family="Inter,sans-serif">'+num(n)+'</text>'+
      '<text x="'+(+X(0)-8)+'" y="'+(+Y(n)+7)+'" text-anchor="end" font-size="20" font-weight="800" fill="#9BA5B8" font-family="Inter,sans-serif">'+num(n)+'</text>'; });
    function seg(L,attr){ var y1=L.py+L.m.n*(-7-L.px)/L.m.d, y2=L.py+L.m.n*(7-L.px)/L.m.d; return '<line x1="'+X(-7)+'" y1="'+Y(y1)+'" x2="'+X(7)+'" y2="'+Y(y2)+'" '+attr+'/>'; }
    h+=seg(f,'stroke="#C9D1E0" stroke-width="5" stroke-dasharray="14 10"')+seg(g,'stroke="#FF4B4B" stroke-width="6" stroke-linecap="round"');
    (dots||[]).forEach(function(p){ h+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="9" fill="'+dotCol+'" stroke="#0E1016" stroke-width="3"/>'; });
    var lx=f.m.n>0?8:S-112;
    h+='<rect x="'+lx+'" y="8" width="104" height="72" rx="10" fill="#0E1016" fill-opacity=".88" stroke="#343B4D" stroke-width="2"/>'+
       '<path d="M'+(lx+12)+' 30h40" stroke="#C9D1E0" stroke-width="5" stroke-dasharray="12 8"/><text x="'+(lx+64)+'" y="38" font-size="24" font-weight="800" fill="#C9D1E0" font-family="Inter,sans-serif">f</text>'+
       '<path d="M'+(lx+12)+' 60h40" stroke="#FF4B4B" stroke-width="6"/><text x="'+(lx+64)+'" y="68" font-size="24" font-weight="800" fill="#FF4B4B" font-family="Inter,sans-serif">g</text>';
    return '<svg class="'+PFX+'-graph" width="'+S+'" height="'+S+'" viewBox="0 0 '+S+' '+S+'" role="img" aria-label="Graph of two lines: f dashed and g solid red">'+h+'</svg>'; }
  
  /* ================= QUESTION GENERATORS =================
     Each returns {topic,prompt,visual,choices[0]=correct,explain,data,check}. check(val) is an independent
     test of whether a choice is right; the build step rejects any question where a distractor also passes. */
  var GEN={
  vDescribe:function(){ var d=nz(-9,9);
    return { topic:'Vertical shifts', prompt:'How does '+eq('g(x) = '+fnot(0,d))+' move the graph of f(x)?', data:{dx:0,dy:d},
      check:function(v){ return v.dx===0&&v.dy===d; },
      choices:[ CD(0,d), CD(0,-d,'Outside the parentheses the sign means what it says: + is up, '+MINUS+' is down.'), CD(d,0,W_OUT), CD(-d,0,W_OUT) ],
      explain:'A number <b>outside</b> f(x) changes the outputs, so the graph moves up or down: '+eq(fnot(0,d))+' is '+low(dirStr(0,d))+'.' }; },
  hDescribe:function(){ var c=nz(-9,9);
    return { topic:'Horizontal shifts', prompt:'How does '+eq('g(x) = '+fnot(c,0))+' move the graph of f(x)?', data:{dx:c,dy:0},
      check:function(v){ return v.dx===c&&v.dy===0; },
      choices:[ CD(c,0), CD(-c,0,'Inside the parentheses the shift goes opposite the sign: x '+MINUS+' is right, x + is left.'), CD(0,c,W_IN), CD(0,-c,W_IN) ],
      explain:'A number <b>inside</b> with x moves the graph left or right, opposite the sign: '+eq(fnot(c,0))+' is '+low(dirStr(c,0))+'.' }; },
  vWrite:function(){ var d=nz(-9,9), w='Inside the parentheses moves the graph left or right. Up and down go outside.';
    return { topic:'Vertical shifts', prompt:'The graph of f(x) is translated <b>'+low(dirStr(0,d))+'</b>. Which equation is g(x)?', data:{dx:0,dy:d},
      check:function(v){ return v.dx===0&&v.dy===d; },
      choices:[ CN(0,d), CN(0,-d,'Outside the parentheses, up is + and down is '+MINUS+'.'), CN(d,0,w), CN(-d,0,w) ],
      explain:'Up and down go <b>outside</b> the parentheses: '+low(dirStr(0,d))+' is '+eq('g(x) = '+fnot(0,d))+'.' }; },
  hWrite:function(){ var c=nz(-9,9), w='Outside the parentheses moves the graph up or down. Left and right go inside with x.';
    return { topic:'Horizontal shifts', prompt:'The graph of f(x) is translated <b>'+low(dirStr(c,0))+'</b>. Which equation is g(x)?', data:{dx:c,dy:0},
      check:function(v){ return v.dx===c&&v.dy===0; },
      choices:[ CN(c,0), CN(-c,0,'Inside goes opposite the sign: right is x '+MINUS+' a number, left is x + a number.'), CN(0,c,w), CN(0,-c,w) ],
      explain:'Left and right go <b>inside</b> with x, opposite the sign: '+low(dirStr(c,0))+' is '+eq('g(x) = '+fnot(c,0))+'.' }; },
  newYInt:function(){ var m=pick(SLOPES), b=nz(-9,9), d=nz(-9,9), nb=b+d, L=moved(m,0,b,0,d);
    return { topic:'Vertical shifts', prompt:eq(fx('f',m,b))+' is translated <b>'+low(dirStr(0,d))+'</b>. What is the new <span class="c-b">y-intercept</span>?', data:{m:m,b:b,dy:d},
      check:function(v){ return v.n!==undefined&&rEq(v,R(L.C,L.B)); },                 /* y where the moved line meets x = 0 */
      choices:[ C(num(nb),R(nb,1)), C(num(b-d),R(b-d,1),'Up adds to b and down subtracts. This shift is '+(d>0?'up':'down')+'.'),
        C(num(Math.abs(d)),R(Math.abs(d),1),'That is the size of the shift. Start at b = '+num(b)+' and move '+low(dirStr(0,d))+'.'),
        C(num(b),R(b,1),'That is the old y-intercept. The whole line moved, so b changes.') ],
      explain:'Start at b = '+num(b)+' and move '+low(dirStr(0,d))+': the new y-intercept is '+B(num(nb))+'.' }; },
  eqV:function(){ var m=pick(SLOPES), b=nz(-9,9), d=nz(-9,9), ms=R(m.n+d*m.d,m.d), L=moved(m,0,b,0,d); if(ms.n===0) return null;
    return { topic:'New equations', prompt:eq(fx('f',m,b))+' and '+eq('g(x) = '+fnot(0,d))+'. Which is g(x)?', data:{m:m,b:b},
      check:function(v){ return v.A!==undefined&&sameLine(v,L); },
      choices:[ CL(m,b+d), CL(m,b-d,'Check the sign: '+fnot(0,d)+' shifts '+(d>0?'up':'down')+', so b goes '+(d>0?'up':'down')+' by '+Math.abs(d)+'.'),
        CL(ms,b,'A translation never changes the slope. Only b changes here.'),
        CL(m,d,'That replaces b with the shift. Add the shift to b instead.') ],
      explain:'Same slope, and b changes by the shift: '+num(b)+sgn(d)+' = '+B(num(b+d))+'.' }; },
  eqH:function(){ var m=R(pick([2,-2,3,-3,4,-4]),1), b=nz(-6,6), c=nz(-4,4), nb=b-m.n*c, L=moved(m,0,b,c,0); if(m.n===c) return null;
    var inner=num(m.n)+'(x'+sgn(-c)+')'+sgn(b);
    return { topic:'New equations', prompt:eq(fx('f',m,b))+' and '+eq('g(x) = '+fnot(c,0))+'. Which is g(x)?', data:{m:m,b:b},
      check:function(v){ return v.A!==undefined&&sameLine(v,L); },
      choices:[ CL(m,nb), CL(m,b-c,'Distribute: in '+eq(inner)+' the '+num(m.n)+' multiplies the '+Math.abs(c)+' too.'),
        CL(m,b+m.n*c,'Sign slip. Substitute exactly what is inside: '+eq(inner)+'.'),
        CL(R(m.n-c,1),b,'The slope stays '+num(m.n)+'. Replace x with (x'+sgn(-c)+') instead.') ],
      explain:'Replace x with (x'+sgn(-c)+'): '+eq(inner)+' = '+eq(num(m.n)+'x'+sgn(-m.n*c)+sgn(b))+', so '+eq(fx('g',m,nb))+'.' }; },
  eqCompare:function(){ var m=pick(SLOPES), b=nz(-9,9), d=nz(-9,9), b2=b+d, L=lineSI(m,b2); if(b2===0) return null;
    return { topic:'New equations', prompt:eq(fx('f',m,b))+' and '+eq(fx('g',m,b2))+'. How was f(x) shifted up or down to make g(x)?', data:{m:m,b:b,b2:b2},
      check:function(v){ return v.dx===0&&sameLine(moved(m,0,b,0,v.dy),L); },
      choices:[ CD(0,d), CD(0,-d,'Compare the y-intercepts: b goes from '+num(b)+' to '+num(b2)+', which is '+(d>0?'up':'down')+'.'),
        CD(0,b2,'That is g’s y-intercept. The shift is the change in b.'), CD(0,b,'That is f’s y-intercept. The shift is the change in b.') ],
      explain:'The slopes match, so only b changed: from '+num(b)+' to '+num(b2)+' is '+low(dirStr(0,d))+'.' }; },
  slopeStays:function(){ var m=pick(SLOPES), b=nz(-9,9), s=nz(-9,9), hz=Math.random()<0.5, dx=hz?s:0, dy=hz?0:s, L=moved(m,0,b,dx,dy);
    var ms=R(m.n+s*m.d,m.d), ng=R(-m.n,m.d); if(Math.abs(s)<2) return null;
    return { topic:'New equations', prompt:eq(fx('f',m,b))+' is translated <b>'+low(dirStr(dx,dy))+'</b>. What is the <span class="c-m">slope</span> of the new line?', data:{m:m},
      check:function(v){ return v.n!==undefined&&rEq(v,R(-L.A,L.B)); },                /* slope read off the moved line */
      choices:[ C(fmtR(m),m), C(fmtR(ms),ms,'Don’t add the shift to the slope. A translation slides the line without tilting it.'),
        C(fmtR(ng),ng,'A slide never flips a line. The slope keeps its sign.'),
        C(num(s),R(s,1),'That is the shift. The slope is still the number with x.') ],
      explain:'A translation slides every point the same way, so the line stays just as steep. The slope is still '+M(m)+'.' }; },
  graphEq:function(){ var m=pick(GS), b=ri(-4,4), d=nz(-6,6); if(Math.abs(d)<2||Math.abs(b+d)>5) return null; var L=moved(m,0,b,0,d);
    var w='The line moved up or down, so the number goes outside the parentheses.';
    return { topic:'Graphs', prompt:'f (dashed) slides up or down to make g (red). Which is g(x)?', data:{m:m,fp:[0,b]},
      visual:graphSVG({m:m,px:0,py:b},{m:m,px:0,py:b+d},[[0,b],[0,b+d]],'#FF3DB4'),
      check:function(v){ return v.dx!==undefined&&sameLine(moved(m,0,b,v.dx,v.dy),L); },
      choices:[ CN(0,d,'',1), CN(0,-d,'The red line crosses the y-axis '+(d>0?'above':'below')+' the dashed one, so the shift is '+(d>0?'up':'down')+'.',1), CN(d,0,w,1), CN(-d,0,w,1) ],
      explain:'Count between the y-intercepts: '+low(dirStr(0,d))+', so '+eq('g(x) = '+fnot(0,d))+'.' }; },
  graphHow:function(){ var m=pick(GS), b=ri(-4,4), d=nz(-6,6); if(Math.abs(d)<2||Math.abs(b+d)>5) return null; var L=moved(m,0,b,0,d);
    var k=Math.abs(d), h=k*m.d/Math.abs(m.n), alt=(h%1===0&&h!==k)?h:(k<6?k+1:k-1), sg=d>0?1:-1, w='Count along the y-axis, from one y-intercept to the other.';
    return { topic:'Graphs', prompt:'f (dashed) slides up or down to make g (red). How far?', data:{m:m,fp:[0,b]},
      visual:graphSVG({m:m,px:0,py:b},{m:m,px:0,py:b+d},[[0,b],[0,b+d]],'#FF3DB4'),
      check:function(v){ return v.dx===0&&sameLine(moved(m,0,b,0,v.dy),L); },
      choices:[ CD(0,d), CD(0,-d,'The red line crosses the y-axis '+(d>0?'above':'below')+' the dashed one, so the shift is '+(d>0?'up':'down')+'.'), CD(0,sg*alt,w), CD(0,-sg*alt,w) ],
      explain:'From the dashed line’s y-intercept to the red line’s y-intercept is '+low(dirStr(0,d))+'.' }; },
  graphH:function(){ var m=pick(GS), a=ri(-4,4), c=nz(-6,6); if(Math.abs(c)<2||Math.abs(a+c)>5) return null; var L=linePS(m,a+c,0);
    var w='The line moved left or right, so the number goes inside with x.';
    return { topic:'Graphs', prompt:'f (dashed) slides left or right to make g (red). Which is g(x)?', data:{m:m,fp:[a,0]},
      visual:graphSVG({m:m,px:a,py:0},{m:m,px:a+c,py:0},[[a,0],[a+c,0]],'#2DE2C8'),
      check:function(v){ return v.dx!==undefined&&sameLine(moved(m,a,0,v.dx,v.dy),L); },
      choices:[ CN(c,0,'',1), CN(-c,0,'Inside goes opposite the sign: the line moved '+(c>0?'right':'left')+', so it is x '+(c>0?MINUS:'+')+' '+Math.abs(c)+'.',1), CN(0,c,w,1), CN(0,-c,w,1) ],
      explain:'Count between the x-intercepts: '+low(dirStr(c,0))+'. Inside goes opposite the sign: '+eq('g(x) = '+fnot(c,0))+'.' }; }
  };
  var TOPICS={ 'Vertical shifts':['vDescribe','vWrite','newYInt'], 'Horizontal shifts':['hDescribe','hWrite'], 'Graphs':['graphEq','graphHow','graphH'], 'New equations':['eqV','eqH','eqCompare','slopeStays'] };
  var BAG=['Vertical shifts','Vertical shifts','Horizontal shifts','Horizontal shifts','Graphs','Graphs','New equations','New equations'];
  function build(type){ for(var tries=0;tries<400;tries++){ var q=GEN[type](); if(!q) continue;
      var keys=q.choices.map(function(c){ return c.key; }); if(new Set(keys).size!==4) continue;
      if(!q.check(q.choices[0].val)) continue;                                                  // the answer must pass the independent check
      if(q.choices.slice(1).some(function(c){ return q.check(c.val); })) continue;              // and no distractor may pass it
      q.type=type; q.choices.forEach(function(c,i){ c.ok=i===0; });
      for(var i=3;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=q.choices[i]; q.choices[i]=q.choices[j]; q.choices[j]=t; }
      q.visual=q.visual||''; delete q.check; return q; } throw new Error('generator failed: '+type); }
  var topicBag=[], lastType='';
  return { build:build }; }

var SETS={
  mult:{ name:'Multiplication facts', make:makeMult, topics:[['f03','Facts 0–3',['Facts 0–3'],1],['f46','Facts 4–6',['Facts 4–6'],2],['f79','Facts 7–9',['Facts 7–9'],3],['f1012','Facts 10–12',['Facts 10–12'],2]] },
  slope:{ name:'Slope-intercept form', make:makeLinear, topics:[['write','Write the equation',['siBuild']],['slope','Find the slope',['siSlope']],['yint','Find the y-intercept',['siYInt']],['graph','Read a graph',['graphSlope','graphYInt','graphXInt']]] },
  point:{ name:'Point-slope form', make:makeLinear, topics:[['write','Write the equation',['psWrite']],['point','Find the point',['psPoint']],['slope','Find the slope',['psSlope']]] },
  hoy:{ name:'HOY & VUX', make:makeLinear, topics:[['describe','Describe the line',['hvType']],['graph','Match the graph',['hvGraph']],['slope','Find the slope',['slopeHV']]] },
  shift:{ name:'Linear transformations', make:makeShift, topics:[['vs','Vertical shifts',['vDescribe','vWrite','newYInt']],['hs','Horizontal shifts',['hDescribe','hWrite']],['gr','Graphs',['graphEq','graphHow','graphH']],['ne','New equations',['eqV','eqH','eqCompare','slopeStays']]] }
};

function plain(h){ return String(h).replace(/<span class="[a-z]+-fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,'$1/$2').replace(/<[^>]+>/g,''); }
function params(){ var qs={}; try{ (location.search||'').replace(/^\?/,'').split('&').forEach(function(kv){ var p=kv.split('='); if(p[0]) qs[decodeURIComponent(p[0])]=decodeURIComponent(p[1]||''); }); }catch(e){} return qs; }

/* Returns null when the link names no set, so a game opened on its own plays exactly as it always has. */
function forGame(PFX){
  var qs=params(), id=qs.set; if(!SETS[id]) return null;
  var set=SETS[id], want=(qs.topics||'').split(','), picked=set.topics.filter(function(t){ return want.indexOf(t[0])>=0; });
  if(!picked.length) picked=set.topics;
  /* sentence-length prompts: the facts games set their prompt at 104px on one line, so give it room to wrap */
  if(id!=='mult'){ try{ var st=document.createElement('style'); st.textContent='.'+PFX+'-prompt{ font:700 36px/1.3 var(--body) !important; height:auto !important; min-height:96px; white-space:normal !important; overflow:visible !important; text-align:left !important; }'; document.head.appendChild(st); }catch(e){} }
  var Q=set.make(PFX), bag=[]; picked.forEach(function(t){ for(var i=0;i<(t[3]||1);i++) bag.push(t); });
  var topicBag=[], lastType='', lastFact='';
  function next(){ var q; for(var n=0;n<20;n++){ if(!topicBag.length) topicBag=bag.slice().sort(function(){ return Math.random()-0.5; });
      var t=topicBag.pop(), list=t[2], type; do{ type=list[Math.floor(Math.random()*list.length)]; }while(type===lastType&&list.length>1); lastType=type;
      q=Q.build(type); q.topic=t[1];
      if(id!=='mult') return q;
      var k=Math.min(q.data.a,q.data.b)+'x'+Math.max(q.data.a,q.data.b); if(k!==lastFact){ lastFact=k; return q; } }
    return q; }
  /* bonus waves print the answers on small targets: no pictures, short labels */
  function short(max){ var q; for(var n=0;n<60;n++){ q=next(); if(!q.visual&&q.choices.every(function(c){ return plain(c.html).length<=max; })) return q; } return q; }
  return { set:id, name:set.name, custom:true, suffix:'_'+id+'_'+picked.map(function(t){ return t[0]; }).join('-'),
    topicTable:function(){ var o={}; picked.forEach(function(t){ o[t[1]]=[0,0]; }); return o; },
    next:next, short:short };
}

window.SpitzQ={ sets:SETS, forGame:forGame };
})();
