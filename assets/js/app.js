/* TomTalk Phòng Tập Nói — logic giao diện. Cần nạp data.js trước. */
(function(){
'use strict';
/* ================= PRODUCT LAYER ================= */
var MODULES=[
 {name:'Vững tâm lý',cats:['Vượt run sợ'],d:'Biến run sợ thành hào hứng, xử lý quên bài và ánh mắt giám khảo.'},
 {name:'Giọng nói & hình thể',cats:['Giọng nói','Ngôn ngữ cơ thể'],d:'Hơi thở, giọng vang, tư thế, ánh nhìn và cử chỉ.'},
 {name:'Xây nội dung',cats:['Xây nội dung','Mở – Thân – Kết'],d:'Tìm ý, chọn góc nhìn, dựng mở bài, thân bài, kết bài.'},
 {name:'Giao tiếp & ứng biến',cats:['Lắng nghe & phản hồi','Ứng biến','Lời nói văn minh'],d:'Lắng nghe, góp ý, pitch và lời nói văn minh.'}
];
var HERO={
 th:{h:'Nhà hùng biện nhí, <em>lên sóng</em> thôi!',s:'Mỗi ngày một trò chơi nói: quay chủ đề, kể chuyện một phút, sưu tầm huy hiệu. Bố mẹ có thể ngồi nghe cùng con.'},
 thcs:{h:'Dám nói. Nói hay. <em>Nói có duyên.</em>',s:'Tự tin trước lớp, trước ban giám khảo và trước chính mình, với chủ đề sát tuổi 11–15.'},
 thpt:{h:'Từ trái tim <em>đến sân khấu TED.</em>',s:'Chuẩn bị cho hùng biện, phỏng vấn học bổng và những lần cần lên tiếng vì điều mình tin.'},
 dl:{h:'Nói để được lắng nghe. <em>Nói để tạo ảnh hưởng.</em>',s:'Pitch ý tưởng, phát biểu trong họp, phỏng vấn và xử lý tình huống khó, mỗi ngày 5 phút.'}
};
var ROUTE_META={
 'trang-chu':'TomTalk Phòng Tập Nói – Luyện Kỹ Năng Thuyết Trình, Hùng Biện & Giao Tiếp Trực Tuyến',
 'ky-nang':'Lộ Trình Kỹ Năng Thuyết Trình & Hùng Biện (4 Chặng) | TomTalk Phòng Tập Nói',
 'thuc-chien':'Phòng Thu Luyện Nói & Vòng Quay Chủ Đề Bấm Giờ | TomTalk Phòng Tập Nói',
 'ung-xu':'48 Thẻ Luyện Ứng Xử, Giao Tiếp & Phỏng Vấn | TomTalk Phòng Tập Nói',
 'nghe-nghiep':'Nghề Gì Cần Gì – Cẩm Nang Giao Tiếp 14 Nghề Nghiệp | TomTalk Phòng Tập Nói'
};
var RANKS=[[0,'Tân binh'],[100,'Người dẫn'],[300,'Diễn giả'],[600,'Nhà hùng biện'],[1000,'Huyền thoại sân khấu']];
var BADGES=[
 {n:'Lên sóng lần đầu',d:'Hoàn thành 1 lượt nói',ic:'i-mic',ok:function(c){return c.st.sessions>=1}},
 {n:'Mười lượt micro',d:'Hoàn thành 10 lượt nói',ic:'i-star',ok:function(c){return c.st.sessions>=10}},
 {n:'Đúng giờ như MC',d:'3 lượt nói đúng giờ',ic:'i-clock',ok:function(c){return c.st.ontime>=3}},
 {n:'Chuỗi 3 ngày',d:'Luyện 3 ngày liên tiếp',ic:'i-flame',ok:function(c){return c.streak>=3}},
 {n:'Vững tâm lý',d:'Học xong chặng 1',ic:'i-target',ok:function(c){return c.m1}},
 {n:'Chăm học',d:'Học 10 bài kỹ năng',ic:'i-book',ok:function(c){return c.lessons>=10}},
 {n:'Thám tử nghề nghiệp',d:'Đoán đúng 5 nghề',ic:'i-bag',ok:function(c){return c.st.guessRight>=5}}
];

/* ================= STATE ================= */
var store={get:function(k,d){try{var v=localStorage.getItem('tt_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem('tt_'+k,JSON.stringify(v))}catch(e){}}};
var S={level:store.get('level','thcs'),lesson:null,qCat:'all',qMode:'deck',qi:0,flipped:false,cField:'Tất cả',sl:[3,3,3]};
if(!LEVELS.some(function(l){return l.id===S.level}))S.level='thcs';
var DONE=store.get('done',{}),ST=store.get('stats',{xp:0,sessions:0,ontime:0,guessRight:0}),DAYS=store.get('days',[]);
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fmt(sec){var neg=sec<0;sec=Math.abs(Math.round(sec));var m=Math.floor(sec/60),s=sec%60;return (neg?'+':'')+m+':'+(s<10?'0':'')+s}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function dayKey(d){d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function dayIndex(n){var d=new Date();return (d.getFullYear()*372+d.getMonth()*31+d.getDate())%n}
function lvl(){return LEVELS.filter(function(l){return l.id===S.level})[0]}
function tipsFor(l){return TIPS.filter(function(t){return t.lv.indexOf(l)>-1})}
function modesFor(l){return MODES.filter(function(m){return m.lv.indexOf(l)>-1})}
function icon(id,cls){return '<svg class="i'+(cls?' '+cls:'')+'"><use href="#'+id+'"/></svg>'}
function reduce(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
function lessonsFor(l){var t=tipsFor(l),out=[];MODULES.forEach(function(m,mi){t.forEach(function(x){if(m.cats.indexOf(x.cat)>-1)out.push({tip:x,mi:mi})})});return out}
function streak(){
  var set={};DAYS.forEach(function(k){set[k]=1});var d=new Date(),n=0;
  if(!set[dayKey(d)])d.setDate(d.getDate()-1);
  while(set[dayKey(d)]){n++;d.setDate(d.getDate()-1)}
  return n;
}
function rank(){var r=RANKS[0],nx=null;for(var i=0;i<RANKS.length;i++){if(ST.xp>=RANKS[i][0]){r=RANKS[i];nx=RANKS[i+1]||null}}return {name:r[1],from:r[0],next:nx}}
function ctx(){var L=lessonsFor(S.level);var m1=L.filter(function(x){return x.mi===0});return {st:ST,streak:streak(),lessons:Object.keys(DONE).length,m1:m1.length>0&&m1.every(function(x){return DONE[x.tip.id]})}}
function earned(){var c=ctx();return BADGES.filter(function(b){return b.ok(c)}).map(function(b){return b.n})}
function toast(html){var t=document.createElement('div');t.className='toast';t.innerHTML=html;$('toasts').appendChild(t);setTimeout(function(){t.remove()},2600)}
function addXP(n,label){
  var before=earned();
  ST.xp+=n;var k=dayKey();if(DAYS.indexOf(k)<0){DAYS.push(k);DAYS=DAYS.slice(-60)}
  store.set('stats',ST);store.set('days',DAYS);
  toast(icon('i-bolt','f')+'+'+n+' XP · '+esc(label));
  earned().forEach(function(b){if(before.indexOf(b)<0)setTimeout(function(){toast(icon('i-trophy')+'Huy hiệu mới: '+esc(b))},500)});
  renderHud();renderHomeStats();renderBadges();
}

/* ================= THEME & CHROME ================= */
function initTheme(){
  var saved=store.get('theme',null);
  if(saved==='dark'||saved==='light')document.documentElement.setAttribute('data-theme',saved);
}
initTheme();
var themeBtn=$('themeBtn');
if(themeBtn){
  themeBtn.addEventListener('click',function(){
    var curTheme=document.documentElement.getAttribute('data-theme');
    var isDark=curTheme==='dark'||(!curTheme&&matchMedia('(prefers-color-scheme: dark)').matches);
    var next=isDark?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    store.set('theme',next);
  });
}

function renderHud(){
  $('hStreak').textContent=streak()+' ngày';$('hXp').textContent=ST.xp+' XP';
  $('lvSel').innerHTML=LEVELS.map(function(l){return '<option value="'+l.id+'"'+(l.id===S.level?' selected':'')+'>Cấp: '+l.name+'</option>'}).join('');
}
$('lvSel').addEventListener('change',function(){setLevel(this.value)});
function setLevel(id){
  S.level=id;store.set('level',id);S.lesson=null;S.qi=0;S.flipped=false;
  renderHud();renderHome();renderLessons();renderQs();renderCareers();
  if(P.phase==='idle'||P.phase==='done'){var ms=modesFor(id);if(!ms.some(function(m){return m.id===P.mode.id}))setMode(ms[0].id);newWheel(true);hideAssess()}
  renderModes();renderScaffold();renderDaily();
}

/* ================= HOME ================= */
function renderHome(){
  var L=lvl(),H=HERO[L.id];
  $('h-home').innerHTML=H.h;$('heroSub').textContent=H.s;
  $('persona').innerHTML=LEVELS.map(function(l){return '<button type="button" role="radio" aria-checked="'+(l.id===S.level)+'" data-lv="'+l.id+'"><b>'+l.name+'</b><small>'+l.age+'</small></button>'}).join('');
  var d=daily();
  $('preview').innerHTML='<div class="ph"><span class="lbl">Thử thách hôm nay · '+L.name+'</span><span class="live"><i></i>ON AIR</span></div><p class="t">“'+esc(d.tp.t)+'”</p><div class="wave" aria-hidden="true">'+Array.apply(null,Array(28)).map(function(_,i){return '<i style="animation-delay:-'+((i*137)%1400)/1000+'s"></i>'}).join('')+'</div><div class="times"><div><small>Thời gian chuẩn bị</small><b>'+fmt(d.md.prep)+'</b></div><div><small>Thời gian lên sóng</small><b>'+fmt(d.md.speak)+'</b></div></div><button class="btn primary" type="button" id="goDaily">'+icon('i-mic')+'Nhận thử thách · +15 XP thưởng</button>';
  $('goDaily').onclick=startDaily;
  var tiles=[
    ['i-book','Lộ trình kỹ năng','ky-nang','Chia làm 4 chặng từ tâm lý, giọng nói đến dàn ý; mỗi bài kèm bài tập áp dụng ngay.',tipsFor(L.id).length+' bài học'],
    ['i-mic','Phòng thu bấm giờ','thuc-chien','Quay chủ đề ngẫu nhiên, đếm ngược giờ chuẩn bị, lên sóng ON AIR và tự chấm điểm.',TOPICS[L.id].length+' chủ đề'],
    ['i-chat','Thẻ luyện ứng xử','ung-xu','Luyện trả lời tình huống thực tế và phỏng vấn dạng thẻ lật 3D có gợi ý từng bước.',QS.filter(function(q){return q[0]===L.id}).length+' tình huống'],
    ['i-bag','Nghề gì cần gì','nghe-nghiep','Trắc nghiệm phong cách giao tiếp, trò chơi đoán nghề và bài luyện theo từng ngành.',CAREERS.length+' nghề nghiệp']
  ];
  $('feat').innerHTML=tiles.map(function(t,i){
    var c=['o','v','gr','g'][i];
    var pCls=['o','v','good','warn'][i];
    return '<a class="ft" href="#'+t[2]+'"><div class="ft-top"><span class="ic '+c+'" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center">'+icon(t[0])+'</span><span class="pill '+pCls+'">'+t[4]+'</span></div><h3>'+t[1]+'</h3><p>'+t[3]+'</p><span class="go">Mở công cụ'+icon('i-arrow')+'</span></a>';
  }).join('');
  renderPath();renderHomeStats();renderBadges();
  var tl=tipsFor(L.id),tip=tl[dayIndex(tl.length)];
  $('tipOfDay').innerHTML='<div class="tip-box"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><p class="eyebrow">Mẹo luyện nói hôm nay</p><span class="pill o">'+esc(tip.cat)+'</span></div><h3>'+esc(tip.t)+'</h3><p class="muted">'+esc(L.id==='th'&&tip.kid?tip.kid:tip.s)+'</p><div style="margin-top:4px"><a href="#ky-nang" class="btn sm" data-tip="'+tip.id+'">Xem chi tiết bài học'+icon('i-arrow')+'</a></div></div>';
}
$('persona').addEventListener('click',function(e){var b=e.target.closest('[data-lv]');if(b)setLevel(b.getAttribute('data-lv'))});
function renderHomeStats(){
  var L=lessonsFor(S.level),done=L.filter(function(x){return DONE[x.tip.id]}).length,r=rank();
  var pct=r.next?Math.round((ST.xp-r.from)/(r.next[0]-r.from)*100):100;
  var lesPct=L.length?Math.round(done/L.length*100):0;
  $('statsrow').innerHTML=
   '<div class="card kpi"><span class="ic o">'+icon('i-flame','f')+'</span><div class="kpi-body"><div class="v">'+streak()+' ngày</div><div class="k">Chuỗi luyện liên tiếp</div></div></div>'+
   '<div class="card kpi"><span class="ic g">'+icon('i-bolt','f')+'</span><div class="kpi-body"><div class="v">'+ST.xp+' XP</div><div class="k">Cấp bậc: '+r.name+'</div><div class="bar rankbar" title="'+(r.next?'Còn '+(r.next[0]-ST.xp)+' XP để lên '+r.next[1]:'Cấp cao nhất')+'"><i style="width:'+pct+'%"></i></div></div></div>'+
   '<div class="card kpi"><span class="ic v">'+icon('i-book')+'</span><div class="kpi-body"><div class="v">'+done+'/'+L.length+'</div><div class="k">Bài kỹ năng ('+lesPct+'%)</div></div></div>'+
   '<div class="card kpi"><span class="ic gr">'+icon('i-mic')+'</span><div class="kpi-body"><div class="v">'+ST.sessions+' lượt</div><div class="k">Đã lên sóng phòng thu</div></div></div>';
}
function renderPath(){
  var L=lessonsFor(S.level);
  $('path').innerHTML=MODULES.map(function(m,mi){
    var ls=L.filter(function(x){return x.mi===mi});if(!ls.length)return '';
    var dn=ls.filter(function(x){return DONE[x.tip.id]}).length;
    var full=dn===ls.length;
    var pct=Math.round(dn/ls.length*100);
    return '<button type="button" class="step'+(full?' done':'')+'" data-mod="'+mi+'"><div class="step-top"><span class="no">Chặng 0'+(mi+1)+'</span><span class="step-cnt">'+dn+'/'+ls.length+' bài</span></div><h3>'+m.name+'</h3><p>'+m.d+'</p><div class="bar"><i style="width:'+pct+'%"></i></div><div class="meta"><span>Tiến độ '+pct+'%</span><span>'+(full?'Đã hoàn thành':'Học tiếp →')+'</span></div></button>';
  }).join('');
}
$('path').addEventListener('click',function(e){var b=e.target.closest('[data-mod]');if(!b)return;var mi=+b.getAttribute('data-mod');var ls=lessonsFor(S.level).filter(function(x){return x.mi===mi});var nx=ls.filter(function(x){return !DONE[x.tip.id]})[0]||ls[0];openTip(nx.tip.id)});
function renderBadges(){
  var c=ctx(),n=0;
  $('badges').innerHTML=BADGES.map(function(b){var ok=b.ok(c);if(ok)n++;return '<div class="badge'+(ok?' on':'')+'"><span class="md">'+icon(b.ic)+'</span><span><b>'+b.n+'</b><small>'+b.d+'</small></span></div>'}).join('');
  $('badgeCount').textContent=n+'/'+BADGES.length+' đã mở';
}

/* ================= LESSONS ================= */
function renderLessons(){
  var L=lvl(),list=lessonsFor(L.id);
  if(!S.lesson||!list.some(function(x){return x.tip.id===S.lesson})){var f=list.filter(function(x){return !DONE[x.tip.id]})[0]||list[0];S.lesson=f.tip.id}
  var done=list.filter(function(x){return DONE[x.tip.id]}).length,pct=Math.round(done/list.length*100);
  $('lesIntro').textContent=list.length+' bài học thiết kế cho cấp '+L.name+' ('+L.age+'), biên soạn từ giáo trình của TomTalk. Hoàn thành mỗi bài và bấm “Đánh dấu đã học” để nhận +10 XP.';
  $('lesPct').textContent=done+'/'+list.length+' bài · '+pct+'%';$('lesBar').style.width=pct+'%';
  $('toc').innerHTML=MODULES.map(function(m,mi){var ls=list.filter(function(x){return x.mi===mi});if(!ls.length)return '';var dn=ls.filter(function(x){return DONE[x.tip.id]}).length;return '<div class="mod"><div class="mod-h"><span><span class="k">Chặng 0'+(mi+1)+'</span><b>'+m.name+'</b></span><small>'+dn+'/'+ls.length+'</small></div>'+ls.map(function(x){return '<button type="button" class="les'+(DONE[x.tip.id]?' done':'')+'" aria-current="'+(x.tip.id===S.lesson)+'" data-les="'+x.tip.id+'"><span class="ck">'+icon('i-check')+'</span><span>'+esc(x.tip.t)+'</span></button>'}).join('')+'</div>'}).join('');
  var idx=list.findIndex(function(x){return x.tip.id===S.lesson}),cur=list[idx],t=cur.tip,kid=L.id==='th'&&t.kid,dn=!!DONE[t.id];
  var prev=list[idx-1],next=list[idx+1];
  $('reader').innerHTML='<div class="top-meta"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="pill v">Chặng 0'+(cur.mi+1)+' · '+MODULES[cur.mi].name+'</span><span class="pill o">'+esc(t.cat)+'</span></div><span class="muted" style="font-size:13px;font-weight:700">Bài '+(idx+1)+' / '+list.length+'</span></div><h2>'+esc(t.t)+'</h2><p class="lede">'+esc(kid?t.kid:t.s)+'</p><ol class="steps">'+t.steps.map(function(s){return '<li><span>'+esc(s)+'</span></li>'}).join('')+'</ol><div class="trybox"><p><span class="eyebrow">Bài tập áp dụng ngay</span>'+esc(t.tr)+'</p><a class="btn primary" href="#thuc-chien">'+icon('i-mic')+'Mở Phòng thu thực hành</a></div><p class="srcline">Nguồn học liệu: <b>'+esc(t.src)+'</b></p><div class="rfoot"><button class="btn ghost" type="button" data-les="'+(prev?prev.tip.id:'')+'"'+(prev?'':' disabled')+'>'+icon('i-back')+'Bài trước</button><button class="btn '+(dn?'':'dark')+'" type="button" id="markDone">'+(dn?icon('i-check')+'Đã hoàn thành bài này':'Đánh dấu đã học · +10 XP')+'</button><button class="btn" type="button" data-les="'+(next?next.tip.id:'')+'"'+(next?'':' disabled')+'>Bài tiếp theo'+icon('i-arrow')+'</button></div>';
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-les]');if(b&&b.getAttribute('data-les')){S.lesson=b.getAttribute('data-les');renderLessons();if(window.innerWidth<980||b.closest('.rfoot'))$('reader').scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'});return}
  if(e.target.closest('#markDone')){
    if(DONE[S.lesson]){delete DONE[S.lesson];store.set('done',DONE);renderLessons();renderPath();renderHomeStats();renderBadges();return}
    DONE[S.lesson]=1;store.set('done',DONE);addXP(10,'Học xong một bài');
    var list=lessonsFor(S.level),i=list.findIndex(function(x){return x.tip.id===S.lesson});
    renderLessons();renderPath();
    var nx=list.slice(i+1).filter(function(x){return !DONE[x.tip.id]})[0];
    if(nx){setTimeout(function(){S.lesson=nx.tip.id;renderLessons();$('reader').scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'})},650)}
  }
});
function openTip(id){
  var ok=lessonsFor(S.level).some(function(x){return x.tip.id===id});
  if(ok)S.lesson=id;
  go('ky-nang');renderLessons();
  setTimeout(function(){$('reader').scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'})},40);
}
document.addEventListener('click',function(e){var a=e.target.closest('[data-tip]');if(!a)return;e.preventDefault();openTip(a.getAttribute('data-tip'))});

/* ================= PRACTICE ================= */
var P={phase:'idle',mode:MODES[0],prep:60,speak:60,endAt:0,remaining:0,paused:false,topic:null,angle:null,spoken:0,ratings:{},timer:null,beeped:false,warned:false,daily:false};
var wheel={items:[],rot:0,spinning:false};
var WCOL=['#E5470F','#5B2BC4','#FF9A62','#B4307A'],WTXT=['#fff','#fff','#2A1200','#fff'];
function daily(){var bank=TOPICS[S.level],x=bank[dayIndex(bank.length)];return {tp:{g:x[0],t:x[1]},md:modesFor(S.level)[0]}}
function startDaily(){var d=daily();if(busy()){go('thuc-chien');return}setMode(d.md.id);setTopic(d.tp);P.daily=true;renderStage();hideAssess();go('thuc-chien')}
function renderDaily(){
  var d=daily(),doneToday=store.get('dailyDone','')===dayKey()+S.level;
  $('daily').innerHTML='<div style="min-width:0;flex:1"><b>Thử thách hôm nay</b><small>'+esc(d.tp.t)+'</small></div>'+(doneToday?'<span class="pill good">'+icon('i-check')+'Đã xong</span>':'<button class="btn sm primary" type="button" id="dailyBtn">Nhận · +15 XP</button>');
  var b=$('dailyBtn');if(b)b.onclick=startDaily;
}
function setMode(id){
  var m=MODES.filter(function(x){return x.id===id})[0]||MODES[0];
  P.mode=m;P.prep=m.prep;P.speak=m.speak;P.angle=m.angle?pick(ANGLES[m.angle]):null;
  renderModes();renderScaffold();renderStage();
}
function renderModes(){
  var ms=modesFor(S.level);if(!ms.some(function(m){return m.id===P.mode.id}))ms=ms.concat([P.mode]);
  $('modes').innerHTML=ms.map(function(m){return '<button type="button" class="mode" role="radio" aria-checked="'+(m.id===P.mode.id)+'" data-m="'+m.id+'"><b>'+esc(m.name)+'</b><span class="tm">'+fmt(m.prep)+' chuẩn bị · '+fmt(m.speak)+' nói</span><span class="d">'+esc(m.d)+'</span></button>'}).join('');
}
$('modes').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b||busy())return;setMode(b.getAttribute('data-m'))});
function busy(){return P.phase==='prep'||P.phase==='speak'}
function levelScaffold(l){
  if(l==='th')return ['Chuyện gì đã xảy ra với em?','Em nghĩ gì về nó?','Vì sao?','Em sẽ làm gì tiếp theo?'];
  if(l==='thcs')return ['Chuyện gì đã xảy ra với mình?','Mình nghĩ gì về nó?','Vì sao? (thử qua 3 bộ lọc)','Hành động tiếp theo là gì?'];
  return ['Mở: câu hỏi, câu chuyện hoặc con số gây bất ngờ.','Thông điệp: gói trong một câu.','Ba luận điểm, mỗi luận điểm một ví dụ thật.','Kết: quay lại mở bài và kêu gọi hành động.'];
}
function scaffoldItems(){
  var m=P.mode.id,l=S.level;
  if(m==='bocgoc')return ['Đọc góc nhìn vừa bốc được.','Viết đúng một câu: quan điểm + lý do.','Cho câu đó qua 3 bộ lọc: Thật? Cãi được? Sau đó?'];
  if(m==='30s')return ['Đọc cách kể vừa bốc được.','Một câu mở.','Một ví dụ hoặc một chuyện nhỏ.','Một câu kết.'];
  if(m==='santai')return ['Ngành của bạn giải quyết vấn đề gì cho xã hội?','Ba lý do nên chọn, mỗi lý do một ví dụ thật.','Đoán trước câu hỏi vặn và chuẩn bị câu trả lời.','Kết bằng một lời mời cụ thể.'];
  if(m==='pitch')return ['Vấn đề: ai đang gặp khó khăn gì?','Giải pháp trong một câu.','Bằng chứng: con số, thử nghiệm nhỏ, câu chuyện thật.','Lời đề nghị: người nghe cần làm gì tiếp theo?'];
  if(m==='ungxu'&&l==='th')return ['Em hiểu câu hỏi là…','Em sẽ làm, hoặc em nghĩ là…','Vì…','Ví dụ…'];
  if(m==='ungxu'||m==='hop')return ['Point: nêu ý chính.','Reason: vì sao.','Example: một ví dụ.','Point: chốt lại ý.'];
  return levelScaffold(l);
}
function renderScaffold(){
  var m=P.mode.id;
  $('scafTitle').textContent=(m==='ungxu'&&S.level!=='th')||m==='hop'?'Khung trả lời PREP':m==='bocgoc'?'Một câu · Ba bộ lọc':m==='pitch'?'Khung Elevator Pitch':m==='santai'?'Khung Săn nhân tài':S.level==='th'?'Bốn câu hỏi gợi mở':S.level==='thcs'?'Đừng vội, nghĩ thật sâu':'Cấu trúc Mở – Thân – Kết';
  $('scaffold').innerHTML=scaffoldItems().map(function(s){return '<li>'+esc(s)+'</li>'}).join('');
}
function setTopic(tp){
  P.topic=tp;P.daily=false;
  if(P.mode.angle)P.angle=pick(ANGLES[P.mode.angle]);
  $('notes').value='';
  if(P.phase==='done'){P.phase='idle';hideAssess()}
  renderStage();
}
var RING=2*Math.PI*54;
function renderStage(){
  var tp=P.topic;
  $('mname').textContent='Bước 2 · '+P.mode.name+' ('+lvl().name+')'+(P.daily?' · Thử thách hôm nay':'');
  $('topic').innerHTML=tp?'<small>Chủ đề · '+esc(tp.g||'Tự chọn')+'</small>'+esc(tp.t):'Bấm QUAY ở vòng quay bên trái để bốc chủ đề';
  var a=$('angle');
  if(P.angle){a.hidden=false;a.innerHTML='<span>'+(P.mode.angle==='kid'?'Cách kể':'Góc nhìn')+'</span>'+esc(P.angle)}else{a.hidden=true}
  $('oPrep').textContent=fmt(P.prep);$('oSpeak').textContent=fmt(P.speak);
  var ph=$('phase'),clk=$('clock'),dg=$('digits'),sub=$('csub');
  clk.className='clock';ph.className='phase';
  var frac=1,shown;
  if(P.phase==='idle'){ph.textContent='Sẵn sàng';shown=P.prep;sub.textContent='giờ chuẩn bị'}
  else if(P.phase==='prep'){ph.textContent='Đang chuẩn bị';ph.classList.add('prep');clk.classList.add('prep');shown=P.remaining/1000;sub.textContent='sau đó nói '+fmt(P.speak);frac=Math.max(0,P.remaining/(P.prep*1000))}
  else if(P.phase==='speak'){
    var r=P.remaining/1000;
    if(r<0){ph.textContent='Quá giờ';ph.classList.add('over');clk.classList.add('over');sub.textContent='hãy kết bài ngay'}
    else{ph.textContent='Đang lên sóng';ph.classList.add('speak');clk.classList.add('speak');if(r<=10)clk.classList.add('warn');sub.textContent=r<=10?'chuẩn bị kết bài':'đang tính giờ nói';frac=Math.max(0,P.remaining/(P.speak*1000))}
    shown=r;
  }
  else{ph.textContent='Đã hoàn thành';ph.classList.add('done');shown=P.spoken/1000;sub.textContent='tổng thời gian nói'}
  if(P.paused)ph.textContent='Đang tạm dừng';
  dg.textContent=shown<0?fmt(shown):fmt(Math.ceil(shown-0.001));
  $('ring').style.strokeDashoffset=String(RING*(1-frac));
  var live=P.phase==='speak'&&!P.paused;
  $('onair').classList.toggle('live',live);$('stage').classList.toggle('live',live);
  $('bStart').textContent=P.phase==='done'?'Luyện lại chủ đề này':'Bắt đầu chuẩn bị';
  $('bStart').disabled=busy()||!P.topic;
  $('bSkip').disabled=P.phase==='speak'||P.phase==='done'||!P.topic;
  $('bPause').disabled=!busy();$('bPause').textContent=P.paused?'Tiếp tục':'Tạm dừng';
  $('bStop').disabled=!busy();
  $('spinBtn').disabled=wheel.spinning||busy();
  $('reshuffle').disabled=busy();
  document.querySelectorAll('.mini').forEach(function(b){b.disabled=busy()});
}
var AC=null;
function ensureAudio(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C()}if(AC&&AC.state==='suspended')AC.resume()}catch(e){AC=null}}
function beep(f,d,n){if(!AC)return;try{n=n||1;for(var i=0;i<n;i++){var t=AC.currentTime+i*(d+0.08);var o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.25,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.02)}}catch(e){}}
function tick(){
  if(P.paused)return;
  P.remaining=P.endAt-performance.now();
  if(P.phase==='prep'&&P.remaining<=0){toSpeak();return}
  if(P.phase==='speak'){
    if(!P.warned&&P.remaining<=10000&&P.speak>15){P.warned=true;beep(660,0.12,1)}
    if(!P.beeped&&P.remaining<=0){P.beeped=true;beep(880,0.18,3)}
  }
  renderStage();
}
function startTimer(){clearInterval(P.timer);P.timer=setInterval(tick,200)}
function startPrep(){if(!P.topic)return;ensureAudio();hideAssess();P.phase='prep';P.paused=false;P.endAt=performance.now()+P.prep*1000;P.remaining=P.prep*1000;beep(520,0.1,1);startTimer();renderStage()}
function toSpeak(){ensureAudio();hideAssess();P.phase='speak';P.paused=false;P.beeped=false;P.warned=false;P.endAt=performance.now()+P.speak*1000;P.remaining=P.speak*1000;beep(740,0.25,1);startTimer();renderStage()}
function stop(){
  clearInterval(P.timer);
  if(P.phase==='speak'){var rem=P.paused?P.remaining:P.endAt-performance.now();P.spoken=Math.max(0,P.speak*1000-rem);P.phase='done';P.paused=false;renderStage();showAssess()}
  else{P.phase='idle';P.paused=false;renderStage()}
}
$('bStart').onclick=function(){if(P.phase==='done')P.phase='idle';startPrep()};
$('bSkip').onclick=function(){if(P.topic)toSpeak()};
$('bPause').onclick=function(){if(!busy())return;if(P.paused){P.paused=false;P.endAt=performance.now()+P.remaining}else{P.remaining=P.endAt-performance.now();P.paused=true}renderStage()};
$('bStop').onclick=stop;
document.querySelectorAll('.mini').forEach(function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-adj'),d=+b.getAttribute('data-d');if(k==='prep')P.prep=Math.min(900,Math.max(0,P.prep+d));else P.speak=Math.min(900,Math.max(10,P.speak+d));renderStage()})});

var cv=$('wheel'),cx=cv.getContext('2d'),CW=0;
function segA(){return 2*Math.PI/wheel.items.length}
function norm(a){var t=2*Math.PI;return ((a%t)+t)%t}
function newWheel(setFirst){
  wheel.items=shuffle(TOPICS[S.level].map(function(x){return {g:x[0],t:x[1]}})).slice(0,10);wheel.rot=0;
  if(setFirst){var i=Math.floor(Math.random()*wheel.items.length);wheel.rot=norm(-(i+0.5)*segA());setTopic(wheel.items[i])}
  drawWheel();
}
function sizeCanvas(){var r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1,w=Math.max(200,Math.round(r.width));cv.width=w*d;cv.height=w*d;cx.setTransform(d,0,0,d,0,0);return w}
function drawWheel(){
  if(!CW)CW=sizeCanvas();
  var w=CW,c=w/2,R=c-8,n=wheel.items.length,sa=segA();
  cx.clearRect(0,0,w,w);
  cx.beginPath();cx.arc(c,c,R+6,0,2*Math.PI);cx.fillStyle='#1A1135';cx.fill();
  for(var k=0;k<n;k++){
    var st=-Math.PI/2+wheel.rot+k*sa;
    cx.beginPath();cx.moveTo(c,c);cx.arc(c,c,R,st,st+sa);cx.closePath();cx.fillStyle=WCOL[k%4];cx.fill();
    cx.save();cx.translate(c,c);cx.rotate(st+sa/2);cx.fillStyle=WTXT[k%4];
    cx.font='700 '+Math.max(11,Math.round(w/30))+'px "Be Vietnam Pro", system-ui, sans-serif';cx.textAlign='right';cx.textBaseline='middle';
    var label=wheel.items[k].g;if(label.length>14)label=label.slice(0,13)+'…';cx.fillText(label,R-14,0);cx.restore();
  }
  for(var j=0;j<n;j++){var a=-Math.PI/2+wheel.rot+j*sa;cx.beginPath();cx.arc(c+Math.cos(a)*(R+1),c+Math.sin(a)*(R+1),2.6,0,2*Math.PI);cx.fillStyle='#FFD7A8';cx.fill()}
}
function spin(){
  if(wheel.spinning||busy())return;ensureAudio();
  var n=wheel.items.length,i=Math.floor(Math.random()*n),sa=segA();
  var target=norm(-(i+0.5)*sa+(Math.random()-0.5)*sa*0.6),start=wheel.rot,delta=norm(target-start)+2*Math.PI*5;
  var dur=reduce()?0:3600,t0=performance.now(),last=-1;
  wheel.spinning=true;renderStage();
  function step(now){
    var p=dur?Math.min(1,(now-t0)/dur):1,e=1-Math.pow(1-p,4);
    wheel.rot=start+delta*e;drawWheel();
    var cur=Math.floor(norm(-wheel.rot)/sa);if(cur!==last){last=cur;if(p<1)beep(1200,0.015,1)}
    if(p<1)requestAnimationFrame(step);else{wheel.rot=norm(wheel.rot);wheel.spinning=false;setTopic(wheel.items[i]);beep(990,0.12,2)}
  }
  requestAnimationFrame(step);
}
$('spinBtn').onclick=spin;
$('reshuffle').onclick=function(){if(!busy())newWheel(false)};
$('customForm').addEventListener('submit',function(e){e.preventDefault();var v=$('customTopic').value.trim();if(!v||busy())return;setTopic({g:'Chủ đề tự chọn',t:v});$('customTopic').value=''});
window.addEventListener('resize',function(){CW=0;drawWheel()});

var CRITS=[['open','Mở bài thu hút','banh-kep','mo-bai'],['msg','Thông điệp rõ ràng','4-cau-hoi','5-cau-truoc'],['ev','Ví dụ, bằng chứng thật','5w1h','3-bo-loc'],['voice','Giọng nói rõ, nhịp tốt','to-ro-cham','tieu-chuan-giong'],['body','Ánh mắt và tư thế','phi-ngon-ngu','phi-ngon-ngu']];
function critTip(c){return S.level==='th'?c[2]:c[3]}
function timing(){var sp=P.spoken/1000,tg=P.speak,diff=sp-tg,tol=Math.max(5,tg*0.1);if(Math.abs(diff)<=tol)return {cls:'good',txt:'Đúng giờ',ok:true};if(diff<0)return {cls:'warn',txt:'Ngắn hơn mục tiêu '+Math.round(-diff)+' giây'};return {cls:'bad',txt:'Quá giờ '+Math.round(diff)+' giây'}}
function showAssess(){
  P.ratings={};var tm=timing();
  $('tline').innerHTML='Bạn đã nói <b>'+fmt(P.spoken/1000)+'</b> trên mục tiêu '+fmt(P.speak)+' <span class="pill '+tm.cls+'">'+tm.txt+'</span>';
  $('crits').innerHTML=CRITS.map(function(c){return '<div class="crit"><span class="lab">'+c[1]+'<a href="#ky-nang" data-tip="'+critTip(c)+'">Xem bài học →</a></span><div class="rate" data-k="'+c[0]+'">'+['Chưa đạt','Khá ổn','Rất tốt'].map(function(l,i){return '<button type="button" aria-pressed="false" data-v="'+(i+1)+'">'+l+'</button>'}).join('')+'</div></div>'}).join('');
  $('saveRes').disabled=true;$('result').hidden=true;$('assess').hidden=false;
  $('assess').scrollIntoView({behavior:reduce()?'auto':'smooth',block:'nearest'});
}
function hideAssess(){$('assess').hidden=true}
$('crits').addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;var g=b.parentNode;g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});P.ratings[g.getAttribute('data-k')]=+b.getAttribute('data-v');$('saveRes').disabled=Object.keys(P.ratings).length<CRITS.length});
$('saveRes').onclick=function(){
  var sum=0,min=4,weak=null;CRITS.forEach(function(c){var v=P.ratings[c[0]]||0;sum+=v;if(v<min){min=v;weak=c}});
  var tm=timing();
  var msg=sum>=13?'Lượt nói rất chắc tay! Thử tăng độ khó ở lượt tiếp theo bằng cách giảm 15 giây chuẩn bị.':sum>=10?'Nền tảng tốt. Hãy tập trung cải thiện tiêu chí còn yếu nhất ở lượt sau.':'Mỗi lượt luyện là một bước tiến. Hãy xem lại bài học gợi ý bên dưới rồi thử nói lại chủ đề này.';
  $('result').innerHTML='<b class="big">'+sum+'/15 điểm</b> · '+tm.txt+'<p style="margin-top:6px">'+msg+'</p>'+(min<3?'<p style="margin-top:6px">Gợi ý ôn tập: <a href="#ky-nang" data-tip="'+critTip(weak)+'"><b>'+weak[1]+'</b></a>.</p>':'');
  $('result').hidden=false;$('saveRes').disabled=true;
  ST.sessions++;if(tm.ok)ST.ontime++;
  var h=store.get('hist',[]);h.unshift({d:Date.now(),t:P.topic?P.topic.t:'',m:P.mode.name,lv:S.level,sp:Math.round(P.spoken/1000),tg:P.speak,s:sum});store.set('hist',h.slice(0,12));renderHist();
  var bonus=0;if(P.daily&&store.get('dailyDone','')!==dayKey()+S.level){bonus=15;store.set('dailyDone',dayKey()+S.level);renderDaily()}
  addXP(20+sum+bonus,bonus?'Hoàn thành thử thách hôm nay':'Hoàn thành lượt nói');
};
$('again').onclick=function(){hideAssess();P.phase='idle';renderStage();spin()};
function renderHist(){
  var h=store.get('hist',[]);
  if(!h.length){$('hist').innerHTML='<p class="empty">Chưa có lượt luyện nào được lưu. Sau mỗi lượt nói, hãy tự chấm 5 tiêu chí và bấm “Lưu kết quả” để theo dõi tiến bộ của bạn.</p>';return}
  var ln={};LEVELS.forEach(function(l){ln[l.id]=l.name});
  $('hist').innerHTML='<table><thead><tr><th>Ngày</th><th>Chủ đề đã luyện</th><th>Chế độ</th><th>Thời lượng</th><th>Điểm</th></tr></thead><tbody>'+h.map(function(r){var d=new Date(r.d);return '<tr><td class="n">'+d.getDate()+'/'+(d.getMonth()+1)+'</td><td><b>'+esc(r.t)+'</b></td><td>'+esc(r.m)+' · '+(ln[r.lv]||'')+'</td><td class="n">'+fmt(r.sp)+' / '+fmt(r.tg)+'</td><td class="n"><b>'+r.s+'/15</b></td></tr>'}).join('')+'</tbody></table>';
}

/* ================= Q&A ================= */
function qList(){return QS.filter(function(q){return q[0]===S.level&&(S.qCat==='all'||q[1]===S.qCat)})}
function renderQs(){
  var all=QS.filter(function(q){return q[0]===S.level});
  var cats=[['all','Tất cả']].concat(Object.keys(QCATS).map(function(k){return [k,QCATS[k]]}));
  $('qChips').innerHTML=cats.map(function(c){var n=c[0]==='all'?all.length:all.filter(function(q){return q[1]===c[0]}).length;return '<button type="button" class="chip" aria-pressed="'+(c[0]===S.qCat)+'" data-q="'+c[0]+'">'+c[1]+'<span class="n">'+n+'</span></button>'}).join('');
  document.querySelectorAll('[data-qm]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-qm')===S.qMode))});
  $('qDeck').hidden=S.qMode!=='deck';$('qList').hidden=S.qMode!=='list';
  var list=qList();
  if(S.qMode==='list'){
    $('qList').innerHTML=list.map(function(q){var idx=QS.indexOf(q);return '<article class="card q"><span class="type '+q[1]+'">'+QCATS[q[1]]+'</span><h3>'+esc(q[2])+'</h3><details><summary>Xem gợi ý hướng trả lời</summary><ul>'+q[3].map(function(h){return '<li>'+esc(h)+'</li>'}).join('')+'</ul></details><button class="btn sm" type="button" data-pq="'+idx+'">'+icon('i-mic')+'Đưa vào Phòng thu</button></article>'}).join('');
    return;
  }
  if(!list.length){$('qDeck').innerHTML='';return}
  if(S.qi>=list.length)S.qi=0;
  var q=list[S.qi],idx=QS.indexOf(q);
  $('qDeck').innerHTML='<div class="deck"><div class="flip'+(S.flipped?' flipped':'')+'" id="flip"><div class="inner"><div class="face front" aria-hidden="'+S.flipped+'"><div class="face-top"><span class="type '+q[1]+'">'+QCATS[q[1]]+'</span><span class="face-cnt">Thẻ '+(S.qi+1)+' / '+list.length+'</span></div><p class="qt">'+esc(q[2])+'</p><div class="hintline"><span>'+icon('i-clock')+' Tự trả lời trong 60 giây trước khi lật thẻ</span><span>Nhấn để lật ↻</span></div></div><div class="face back" aria-hidden="'+(!S.flipped)+'"><div class="face-top"><h4>Gợi ý hướng trả lời</h4><span class="face-cnt">Thẻ '+(S.qi+1)+' / '+list.length+'</span></div><p class="q-mini">'+esc(q[2])+'</p><ul>'+q[3].map(function(h){return '<li>'+icon('i-check')+'<span>'+esc(h)+'</span></li>'}).join('')+'</ul></div></div></div><div class="deckbar"><div class="deck-nav"><button class="btn sm" type="button" id="qPrev" aria-label="Thẻ trước">'+icon('i-back')+'Trước</button><span class="cnt">'+(S.qi+1)+' / '+list.length+'</span><button class="btn sm" type="button" id="qNext" aria-label="Thẻ sau">Tiếp'+icon('i-arrow')+'</button></div><div class="deck-actions"><button class="btn sm dark" type="button" id="qFlip">'+icon('i-flip')+(S.flipped?'Xem câu hỏi':'Lật xem gợi ý')+'</button><button class="btn sm" type="button" id="qRand">'+icon('i-dice')+'Ngẫu nhiên</button><button class="btn sm primary" type="button" data-pq="'+idx+'">'+icon('i-mic')+'Luyện trong Phòng thu</button></div></div><div class="dots" aria-hidden="true">'+list.map(function(_,i){return '<i class="'+(i===S.qi?'on':'')+'"></i>'}).join('')+'</div></div>';
}
function qMove(d){var n=qList().length;if(!n)return;S.qi=(S.qi+d+n)%n;S.flipped=false;renderQs()}
$('qChips').addEventListener('click',function(e){var b=e.target.closest('[data-q]');if(!b)return;S.qCat=b.getAttribute('data-q');S.qi=0;S.flipped=false;renderQs()});
document.querySelector('.seg2').addEventListener('click',function(e){var b=e.target.closest('[data-qm]');if(!b)return;S.qMode=b.getAttribute('data-qm');renderQs()});
$('v-ung-xu').addEventListener('click',function(e){
  var t=e.target.closest('button,#flip');if(!t)return;
  if(t.id==='qPrev')qMove(-1);else if(t.id==='qNext')qMove(1);
  else if(t.id==='qFlip'||t.id==='flip'){S.flipped=!S.flipped;$('flip').classList.toggle('flipped',S.flipped);$('flip').querySelector('.front').setAttribute('aria-hidden',String(S.flipped));$('flip').querySelector('.back').setAttribute('aria-hidden',String(!S.flipped));$('qFlip').innerHTML=icon('i-flip')+(S.flipped?'Xem câu hỏi':'Lật xem gợi ý')}
  else if(t.id==='qRand'){var n=qList().length;if(n>1){var k;do{k=Math.floor(Math.random()*n)}while(k===S.qi);S.qi=k;S.flipped=false;renderQs()}}
  else if(t.hasAttribute('data-pq')){var q=QS[+t.getAttribute('data-pq')];practiceCustom({g:QCATS[q[1]],t:q[2]},'ungxu')}
});
document.addEventListener('keydown',function(e){
  if(location.hash!=='#ung-xu'||S.qMode!=='deck')return;
  var tag=(e.target.tagName||'').toLowerCase();if(tag==='input'||tag==='textarea'||tag==='select')return;
  if(e.key==='ArrowRight'){qMove(1);e.preventDefault()}else if(e.key==='ArrowLeft'){qMove(-1);e.preventDefault()}
  else if(e.key===' '&&tag!=='button'){S.flipped=!S.flipped;renderQs();e.preventDefault()}
});
function practiceCustom(tp,modeId){if(busy()){go('thuc-chien');return}setMode(modeId);setTopic(tp);hideAssess();go('thuc-chien')}

/* ================= CAREERS ================= */
var SL=[['Trò chuyện sâu 1-1 với một người','Ít khi','Rất thích'],['Làm việc nhóm & điều phối mọi người','Ít khi','Rất thích'],['Đứng nói hoặc thuyết trình trước đám đông','Còn ngại','Rất thích']];
function renderSliders(){
  $('sliders').innerHTML=SL.map(function(s,i){return '<label for="sl'+i+'"><span class="sl-head"><span>'+s[0]+'</span><span class="sl-val" id="slv'+i+'">Mức '+S.sl[i]+'/5</span></span><input type="range" id="sl'+i+'" min="1" max="5" step="1" value="'+S.sl[i]+'" data-sl="'+i+'"><span class="lr"><span>'+s[1]+'</span><span>'+s[2]+'</span></span></label>'}).join('');
}
$('sliders').addEventListener('input',function(e){
  var i=e.target.getAttribute('data-sl');if(i==null)return;
  S.sl[+i]=+e.target.value;
  var vEl=$('slv'+i);if(vEl)vEl.textContent='Mức '+S.sl[+i]+'/5';
  renderMatches();
});
function renderMatches(){
  var sc=CAREERS.map(function(c,i){var d=0;for(var k=0;k<3;k++)d+=Math.abs(c.r[k]-S.sl[k]);return {i:i,d:d}}).sort(function(a,b){return a.d-b.d}).slice(0,3);
  $('matches').innerHTML=sc.map(function(x,r){var c=CAREERS[x.i];return '<div class="match"><span class="rk">#'+(r+1)+'</span><span><b>'+esc(c.n)+'</b><small>'+esc(c.sk.slice(0,2).join(' · '))+'</small></span><span class="pc">'+Math.round(100-x.d/12*100)+'% hợp</span></div>'}).join('');
}
var G={i:-1,opts:[],done:false,right:0,total:0};
function newGuess(){var idx=Math.floor(Math.random()*CAREERS.length);if(idx===G.i)idx=(idx+1)%CAREERS.length;var others=shuffle(CAREERS.map(function(_,k){return k}).filter(function(k){return k!==idx})).slice(0,3);G.i=idx;G.opts=shuffle(others.concat([idx]));G.done=false;renderGuess()}
function renderGuess(){
  var c=CAREERS[G.i];
  $('guess').innerHTML='<p class="eyebrow">Trò chơi · Đoán nghề qua tình huống</p><h3 class="card-title">Đây là ngày làm việc của nghề nào?</h3><p class="sit">“'+esc(c.sit)+'”</p><div class="opts">'+G.opts.map(function(k){var cls='';if(G.done){if(k===G.i)cls='right';else if(k===G.pickd)cls='wrong'}return '<button type="button" data-g="'+k+'" class="'+cls+'"'+(G.done?' disabled':'')+'>'+esc(CAREERS[k].n)+'</button>'}).join('')+'</div><div class="gfoot"><span>Đoán đúng: <span class="score">'+G.right+'/'+G.total+'</span> (+5 XP / câu)</span><button class="btn sm" type="button" id="gNext">'+(G.done?'Tình huống tiếp':'Đổi câu khác')+icon('i-arrow')+'</button></div>';
}
$('guess').addEventListener('click',function(e){
  if(e.target.closest('#gNext')){newGuess();return}
  var b=e.target.closest('[data-g]');if(!b||G.done)return;
  G.pickd=+b.getAttribute('data-g');G.done=true;G.total++;
  if(G.pickd===G.i){G.right++;ST.guessRight=(ST.guessRight||0)+1;addXP(5,'Đoán đúng nghề')}
  renderGuess();
});
function pips(v){var s='';for(var i=1;i<=5;i++)s+='<i class="'+(i<=v?'on':'')+'"></i>';return s}
function initials(n){return n.split(/[\s\/]+/).filter(Boolean).slice(0,2).map(function(w){return w[0]}).join('').toUpperCase()}
function renderCareers(){
  var st=lvl().stage;
  $('cChips').innerHTML=['Tất cả'].concat(FIELDS).map(function(f){var n=f==='Tất cả'?CAREERS.length:CAREERS.filter(function(c){return c.f===f}).length;return '<button type="button" class="chip" aria-pressed="'+(f===S.cField)+'" data-f="'+esc(f)+'">'+esc(f)+'<span class="n">'+n+'</span></button>'}).join('');
  var shown=S.cField==='Tất cả'?CAREERS:CAREERS.filter(function(c){return c.f===S.cField});
  var lbl={kid:'Gợi ý cho Tiểu học',teen:'Bài tập rèn từ bây giờ',adult:'Bài tập cho người đi làm'};
  $('cList').innerHTML=shown.map(function(c){var idx=CAREERS.indexOf(c);return '<article class="card career"><div class="ch"><span class="ini">'+initials(c.n)+'</span><div><p class="fld">'+esc(c.f)+'</p><h3>'+esc(c.n)+'</h3><p class="roles">'+esc(c.roles)+'</p></div></div><div class="meters">'+[['Giao tiếp 1-1',c.r[0]],['Trao đổi nhóm',c.r[1]],['Trước công chúng',c.r[2]]].map(function(m){return '<div class="meter"><span>'+m[0]+'</span><span class="pips" role="img" aria-label="'+m[1]+' trên 5">'+pips(m[1])+'</span><span class="v">'+m[1]+'/5</span></div>'}).join('')+'</div><div class="skills">'+c.sk.map(function(s){return '<span>'+esc(s)+'</span>'}).join('')+'</div><p class="sitq"><span>Tình huống thực tế</span>'+esc(c.sit)+'</p><p class="ctry"><b>'+lbl[st]+':</b> '+esc(c.p[st])+'</p><button class="btn sm" type="button" data-cp="'+idx+'">'+icon('i-mic')+'Luyện nói về nghề '+esc(c.n)+'</button></article>'}).join('');
}
$('cChips').addEventListener('click',function(e){var b=e.target.closest('[data-f]');if(!b)return;S.cField=b.getAttribute('data-f');renderCareers()});
$('cList').addEventListener('click',function(e){
  var b=e.target.closest('[data-cp]');if(!b)return;var c=CAREERS[+b.getAttribute('data-cp')];
  if(S.level==='th')practiceCustom({g:'Nghề nghiệp',t:'Giới thiệu nghề '+c.n.toLowerCase()+' cho các bạn trong lớp: nghề này làm gì và cần nói giỏi ở điểm nào?'},'kechuyen');
  else if(S.level==='thcs')practiceCustom({g:'Nghề nghiệp',t:'Vì sao người làm '+c.n+' cần giỏi giao tiếp? Kể một tình huống cụ thể.'},'tudo');
  else practiceCustom({g:'Săn nhân tài',t:'Thuyết phục một người vừa ra trường chọn nghề '+c.n+'.'},'santai');
});

/* ================= ROUTER ================= */
var ROUTES=['trang-chu','ky-nang','thuc-chien','ung-xu','nghe-nghiep'],cur=null;
function go(r){if(location.hash.slice(1)===r)route();else location.hash=r}
function route(){
  var r=location.hash.slice(1);if(ROUTES.indexOf(r)<0)r='trang-chu';
  ROUTES.forEach(function(x){$('v-'+x).classList.toggle('on',x===r)});
  document.querySelectorAll('[data-r]').forEach(function(a){if(a.getAttribute('data-r')===r)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(ROUTE_META[r])document.title=ROUTE_META[r];
  if(r!==cur){window.scrollTo(0,0);cur=r}
  if(r==='thuc-chien'){CW=0;drawWheel()}
}
window.addEventListener('hashchange',route);

/* ================= BOOT ================= */
P.mode=modesFor(S.level)[0];P.prep=P.mode.prep;P.speak=P.mode.speak;
renderHud();renderHome();renderLessons();renderModes();renderScaffold();newWheel(true);renderDaily();renderQs();renderSliders();renderMatches();newGuess();renderCareers();renderHist();renderStage();route();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){CW=0;drawWheel()});
})();
