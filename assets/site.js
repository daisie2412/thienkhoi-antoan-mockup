/* Thiên Khôi, Giải Pháp An Toàn. Mockup R2: chỉ lo tương tác. Đầu trang, chân trang, nội dung do build_site.py dựng sẵn. */
(function(){
const B=document.body, $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const D=JSON.parse(($('#tk-data')||{}).textContent||'{}'), R=D.root||'', IMG=R+'assets/img/', VID=R+'assets/video/';
const ic=n=>`<i class="ph-light ph-${n}" aria-hidden="true"></i>`;
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};

/* đầu trang: thu gọn khi rời đỉnh trang */
const sen=$('.top-sentinel');
if(sen) new IntersectionObserver(es=>B.classList.toggle('scrolled',!es[0].isIntersecting)).observe(sen);

/* menu xổ: rê chuột hoặc bấm */
const dds=$$('.dd'); let tm;
const closeAll=ex=>dds.forEach(d=>{if(d!==ex){d.classList.remove('open');$('button',d).setAttribute('aria-expanded','false');}});
dds.forEach(d=>{const b=$('button',d);
 d.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches){clearTimeout(tm);closeAll(d);d.classList.add('open');b.setAttribute('aria-expanded','true');}});
 d.addEventListener('mouseleave',()=>{if(matchMedia('(hover:hover)').matches){tm=setTimeout(()=>{d.classList.remove('open');b.setAttribute('aria-expanded','false');},160);}});
 b.addEventListener('click',e=>{e.stopPropagation();const o=!d.classList.contains('open');closeAll();d.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));});});
document.addEventListener('click',e=>{if(!e.target.closest('.dd')) closeAll();});

/* menu điện thoại */
const bg=$('.burger'); if(bg) bg.onclick=()=>B.classList.toggle('menu-open');
$$('.ov a').forEach(a=>a.addEventListener('click',()=>B.classList.remove('menu-open')));

/* nút ngôn ngữ: chỉ ghi nhớ lựa chọn, không tự chuyển trang */
$$('.langsw a').forEach(a=>a.addEventListener('click',()=>store.set('tk-lang',a.dataset.lang)));

/* ngăn ghi chú duyệt */
const dr=$('.notes'), sc=$('.scrim');
const setN=on=>{dr&&dr.classList.toggle('open',on);sc&&sc.classList.toggle('on',on);};
$$('[data-notes]').forEach(nb=>nb.addEventListener('click',()=>{B.classList.remove('menu-open');setN(true);}));
if(dr) $('.xbtn',dr).onclick=()=>setN(false); if(sc) sc.onclick=()=>setN(false);

/* hộp xem video */
const lb=$('.vlb'), lv=lb&&$('video',lb);
const openV=(f,poster,t,b)=>{lv.src=VID+f+'.mp4';lv.poster=IMG+(poster||f+'.jpg');$('.t',lb).textContent=t;$('.cap .small',lb).textContent='Video: '+b;lb.classList.add('on');lv.play().catch(()=>{});};
const closeV=()=>{if(!lb||!lb.classList.contains('on'))return;lb.classList.remove('on');lv.pause();lv.removeAttribute('src');lv.load();};
if(lb){$('.xbtn',lb).onclick=closeV;lb.addEventListener('click',e=>{if(e.target===lb)closeV();});}
document.addEventListener('click',e=>{const t=e.target.closest('[data-video]');if(t&&lb){e.preventDefault();e.stopPropagation();openV(t.dataset.video,t.dataset.poster,t.dataset.title||'',t.dataset.brand||'');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setN(false);B.classList.remove('menu-open');closeAll();closeV();}});

/* dải video cuộn ngang */
/* dải thẻ 1 hàng: nút trước/sau, tự chạy từ phải qua trái, dừng khi người xem đang dùng */
const VI=document.documentElement.lang==='vi', RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const step=r=>{const k=[...r.children].find(x=>x.offsetWidth>0);return k?k.offsetWidth+(parseFloat(getComputedStyle(r).columnGap)||16):300;};
const go=(r,d)=>{const max=r.scrollWidth-r.clientWidth;
  if(d>0&&r.scrollLeft>=max-8) r.scrollTo({left:0,behavior:'smooth'});
  else if(d<0&&r.scrollLeft<=8) r.scrollTo({left:max,behavior:'smooth'});
  else r.scrollBy({left:d*step(r),behavior:'smooth'});};
$$('.rail-auto').forEach(r=>{const c=document.createElement('div');c.className='rail-ctl ra';
  c.innerHTML=`<button type="button" data-d="-1" aria-label="${VI?'Trước':'Previous'}">${ic('arrow-left')}</button><button type="button" data-d="1" aria-label="${VI?'Tiếp':'Next'}">${ic('arrow-right')}</button>`;
  r.after(c);});
$$('.rail,.rail-auto').forEach(r=>{
  const ctl=r.classList.contains('rail-auto')?r.nextElementSibling:r.parentElement.querySelector('.rail-ctl');
  let hold=0, vis=false;
  const pause=ms=>{hold=Date.now()+ms;};
  if(ctl) $$('button',ctl).forEach(b=>b.addEventListener('click',()=>{pause(8000);go(r,b.dataset.d==='1'?1:-1);}));
  r.addEventListener('mouseenter',()=>pause(1e9)); r.addEventListener('mouseleave',()=>pause(1500));
  r.addEventListener('focusin',()=>pause(1e9)); r.addEventListener('focusout',()=>pause(1500));
  ['touchstart','wheel'].forEach(e=>r.addEventListener(e,()=>pause(6000),{passive:true}));
  new IntersectionObserver(es=>es.forEach(e=>vis=e.isIntersecting),{threshold:.3}).observe(r);
  if(RM) return;
  setInterval(()=>{if(Date.now()<hold||!vis||document.hidden||$('.vlb.on')||r.scrollWidth-r.clientWidth<8)return;go(r,1);},3600);
});
/* đổi bộ lọc thì dải về đầu */
$$('.seg button').forEach(b=>b.addEventListener('click',()=>{const r=b.closest('section')&&b.closest('section').querySelector('.rail-auto');if(r)r.scrollTo({left:0});}));

/* form bản mẫu: báo lỗi dưới ô bắt buộc, không gửi đi đâu */
$$('form[data-mock]').forEach(f=>{f.noValidate=true;
 f.addEventListener('submit',e=>{e.preventDefault();let bad=null;
  $$('[required]',f).forEach(i=>{const fl=i.closest('.fld');const ok=i.type==='checkbox'?i.checked:i.value.trim()!==''&&(i.type!=='email'||/^\S+@\S+\.\S+$/.test(i.value));if(fl)fl.classList.toggle('bad',!ok);if(!ok&&!bad)bad=i;});
  if(bad){bad.focus();return;} f.closest('.form').classList.add('sent');});
 $$('input,textarea',f).forEach(i=>i.addEventListener('input',()=>{const fl=i.closest('.fld');fl&&fl.classList.remove('bad');}));});
const qs=new URLSearchParams(location.search);
if(qs.get('sp')){const t=$('#f-note');if(t)t.value=qs.get('sp')+'\n';}
if(qs.get('kv'))$$('input[name=kv]').forEach(i=>{if(i.value===qs.get('kv'))i.checked=true;});

/* tab băng dán sàn, mở theo #ke-vach, #chong-tron... */
$$('[data-tabs]').forEach(box=>{const bs=$$('.seg button',box), ps=$$('.tabpane',box);
 const show=id=>{let ok=false;bs.forEach(b=>{const on=b.dataset.tab===id;b.classList.toggle('on',on);ok=ok||on;});ps.forEach(p=>p.classList.toggle('on',p.dataset.pane===id));return ok;};
 bs.forEach(b=>b.onclick=()=>{show(b.dataset.tab);history.replaceState(null,'','#'+b.dataset.tab);});
 const fromHash=()=>{const h=location.hash.slice(1);if(h&&show(h)){box.closest('section').scrollIntoView({block:'start'});}};
 fromHash(); window.addEventListener('hashchange',fromHash);});

/* lọc 12 dòng rào, nhận ?nhom= từ menu */
const grid=$('[data-products]');
if(grid){const fb=$$('[data-filter]');
 const apply=c=>{fb.forEach(x=>x.classList.toggle('on',x.dataset.filter===c));$$('.prod',grid).forEach(p=>p.classList.toggle('hide',c!=='all'&&p.dataset.cat!==c));};
 fb.forEach(b=>b.onclick=()=>apply(b.dataset.filter));
 if(qs.get('nhom')!==null&&fb.some(b=>b.dataset.filter===qs.get('nhom'))) apply(qs.get('nhom'));}

/* sơ đồ nhà kho */
$$('[data-map]').forEach(box=>{
 const pick=(id,scroll)=>{$$('.zpanel',box).forEach(p=>p.hidden=p.dataset.zp!==id);$$('.hs',box).forEach(h=>h.classList.toggle('on',h.dataset.z===id));$$('[data-zt]',box).forEach(b=>b.classList.toggle('on',b.dataset.zt===id));
  if(scroll&&innerWidth<768)$('.zp',box).scrollIntoView({behavior:'smooth',block:'start'});};
 $$('.hs',box).forEach(h=>{h.addEventListener('click',()=>pick(h.dataset.z,true));h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(h.dataset.z,true);}});});
 $$('[data-zt]',box).forEach(b=>b.addEventListener('click',()=>pick(b.dataset.zt,true)));
 pick(box.dataset.map||'loi-di-bo');});

/* trang giải pháp: ảnh dính đổi theo khu đang đọc */
const zs=$('[data-zones]');
if(zs){const figs=$$('figure',zs), zn=$('.zn',zs);
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.dataset.z;figs.forEach(f=>f.classList.toggle('on',f.dataset.f===id));const z=(D.zones||[]).find(z=>z.id===id);if(z&&zn)zn.textContent=D.ui.zone_of+' '+z.n+' / 7';}}),{rootMargin:'-45% 0px -50% 0px'});
 $$('.zs-item',zs).forEach(i=>io.observe(i));
 if(location.hash){const t=document.getElementById(location.hash.slice(1));t&&setTimeout(()=>t.scrollIntoView(),60);}}

/* hướng dẫn chọn và checklist */
if(D.guide&&$('#s-out')){const G=D.guide, P=D.products, T=D.tapes;
 const one=sel=>$$(sel+' .opt').forEach(b=>b.onclick=()=>{$$(sel+' .opt').forEach(x=>x.classList.remove('on'));b.classList.add('on');run();});
 one('#s-zone');one('#s-veh');$$('#s-iss .opt').forEach(b=>b.onclick=()=>{b.classList.toggle('on');run();});
 function run(){const z=D.zones.find(z=>z.id===$('#s-zone .on').dataset.z), v=+$('#s-veh .on').dataset.v, iss=$$('#s-iss .on').map(b=>b.dataset.i);
  let out=[],note='';
  if(iss.includes('va')&&z.prods.length){let ids=[...z.prods];
   if(v===0){ids=ids.filter(id=>['tr148','swg','slg','rg142','ctr148'].includes(id));note=G.note_v0;}
   if(v===1){note=G.note_v1;if(!ids.includes('gsr110'))ids.push('gsr110');}
   if(v===3){note=G.note_v3;if(!ids.includes('dr148')&&z.id!=='bai-xe')ids.push('dr148');if(!ids.includes('bo190'))ids.push('bo190');}
   ids.forEach(id=>{const p=P[id];out.push(['plate',p.img,p.name,p.use+'. '+D.ui.code+' '+p.code]);});}
  const t=new Set();if(iss.includes('luong'))t.add('vach');if(iss.includes('tron'))t.add('tron');if(iss.includes('toi')){t.add('dq');t.add('pq');}
  if(iss.includes('va'))z.tapes.forEach(k=>t.add(k));
  t.forEach(k=>out.push(['photo',T[k].img,T[k].name,T[k].use]));
  $('#s-out').innerHTML=`<span class="lbl" style="margin-top:0">${G.suggest} ${z.n}</span><h3 style="margin-bottom:18px">${z.name}</h3>`+
   (out.length?out.map(o=>`<div class="item"><span class="th ${o[0]}"><img src="${IMG+o[1]}" alt=""></span><div><b>${o[2]}</b><span>${o[3]}</span></div></div>`).join(''):`<p class="muted">${G.need_issue}</p>`)+
   (note?`<p class="small" style="margin:14px 0 0;color:var(--tx2)">${note}</p>`:'')+
   `<div class="now"><b>${D.ui.now}</b> ${z.now}</div><div class="btns" style="margin-top:18px"><a class="btn btn-ac btn-sm" href="${D.contact}?kv=${z.id}">${D.ui.survey_zone}<span class="ic">${ic('arrow-up-right')}</span></a></div>`;}
 run();
 const cl=$$('#cl input');
 cl.forEach(i=>i.onchange=()=>{const n=cl.filter(x=>x.checked).length;$('#cl-n').innerHTML=n+'<small>/10</small>';
  $('#cl-h').textContent=n===0?G.cl_s0:n<=2?n+' '+G.cl_s1:n<=5?n+' '+G.cl_s2:n+' '+G.cl_s3;$('#cl-p').textContent=n===0?G.cl_p0:G.cl_p1;});}

/* lọc video, lọc bài viết */
const vf=$('#vf'); if(vf) $$('button',vf).forEach(b=>b.onclick=()=>{$$('button',vf).forEach(x=>x.classList.remove('on'));b.classList.add('on');$$('#vg .vcard').forEach(c=>c.classList.toggle('hide',b.dataset.vf!=='all'&&c.dataset.b!==b.dataset.vf));});
const kf=$('#kt-f'); if(kf) $$('button',kf).forEach(b=>b.onclick=()=>{$$('button',kf).forEach(x=>x.classList.remove('on'));b.classList.add('on');$$('#kt .art').forEach(c=>c.style.display=(b.dataset.c==='all'||c.dataset.c===b.dataset.c)?'':'none');});

/* tài liệu: đếm số tài liệu đã chọn */
if(D.res){const docs=$$('#docs input'), dn=$('#doc-n');const upd=()=>{const n=docs.filter(d=>d.checked).length;dn.textContent=n?D.res.sel_n.replace('{n}',n):D.res.sel_0;};docs.forEach(d=>d.addEventListener('change',upd));upd();}

/* mục lục bài: đánh dấu mục đang đọc */
const tocA=$$('.toc nav a');
if(tocA.length){const tio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)tocA.forEach(x=>x.classList.toggle('on',x.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-25% 0px -65% 0px'});$$('.ps[id]').forEach(s=>tio.observe(s));}

/* hiện dần khi cuộn; lớp an toàn nếu trình duyệt dừng hiệu ứng */
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
$$('.rv').forEach(el=>rio.observe(el));
setTimeout(()=>document.documentElement.classList.add('done'),2600);
})();
