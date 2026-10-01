(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowEnd=(navigator.hardwareConcurrency||4)<=4||innerWidth<700;

/* DATA — ชื่อบริการอ้างอิงจากเอกสารทางการ ควรตรวจสอบชื่อ/สถานะล่าสุดอีกครั้ง */
const S=[
['IaaS','Infrastructure','Elastic Compute Service (ECS)','เช่าเซิร์ฟเวอร์เสมือน เครือข่าย และดิสก์แทนการซื้อฮาร์ดแวร์เอง','ทรัพยากรถูกแบ่งจากเซิร์ฟเวอร์จริงด้วย Virtualization ผู้ใช้เลือกสเปก ระบบปฏิบัติการ และ Region','โฮสต์เว็บเซิร์ฟเวอร์ ระบบหลังบ้านขององค์กร','ยืดหยุ่น ปรับขนาดได้ ไม่ต้องดูแลฮาร์ดแวร์','User → Load Balancer → ECS → Disk'],
['CaaS','Containers','Container Service for Kubernetes (ACK)','บริการจัดการ Container และ Kubernetes แบบ Managed','รัน Application ใน Container เป็นกลุ่ม (Cluster) ระบบช่วยจัดตารางงานและขยายอัตโนมัติ','Microservices, CI/CD','พกพาง่าย ปรับขนาดเร็ว','Registry → Kubernetes Cluster → Pods'],
['PaaS','Platform','ApsaraDB และบริการแพลตฟอร์ม','แพลตฟอร์มพร้อมใช้สำหรับพัฒนาและรันแอป โดยผู้ให้บริการดูแลระบบพื้นฐาน','ผู้พัฒนาโฟกัสที่โค้ด ส่วนฐานข้อมูล/Runtime ถูกจัดการโดยผู้ให้บริการ','ฐานข้อมูลสำหรับเว็บแอป','ลดภาระดูแลระบบ','App → Managed DB → Backup'],
['FaaS','Serverless','Function Compute','รันฟังก์ชันตามเหตุการณ์โดยไม่ต้องจัดการเซิร์ฟเวอร์','โค้ดทำงานเมื่อมี Event (เช่น อัปโหลดไฟล์) ระบบจัดสรรทรัพยากรอัตโนมัติ','ประมวลผลภาพ งานเบื้องหลัง','จ่ายตามการใช้งาน ขยายอัตโนมัติ','Event → Function → Result'],
['DaaS','Desktop','Elastic Desktop Service','Desktop บนคลาวด์ เข้าใช้งานได้จากหลายอุปกรณ์','เครื่อง Desktop รันบน Data Center ผู้ใช้เชื่อมต่อผ่าน Client','ทำงานระยะไกล ห้องปฏิบัติการ','จัดการส่วนกลางง่าย ข้อมูลไม่อยู่บนเครื่องผู้ใช้','Device → Network → Cloud Desktop'],
['Security & Identity','Security','Security Center / RAM','เครื่องมือด้านความปลอดภัยและการจัดการตัวตนและสิทธิ์','RAM กำหนดว่าใครเข้าถึงทรัพยากรใดได้ ส่วน Security ตรวจจับความเสี่ยง','จัดสิทธิ์ทีมพัฒนา','ควบคุมสิทธิ์แบบละเอียด','User → RAM Policy → Resource'],
['IoT','Devices','IoT Platform','เชื่อมต่อและจัดการอุปกรณ์ IoT','อุปกรณ์ส่งข้อมูลเข้าคลาวด์ผ่านโปรโตคอล แล้วส่งต่อไปประมวลผล','เซนเซอร์ในโรงงาน','จัดการอุปกรณ์จำนวนมากแบบรวมศูนย์','Device → IoT Platform → Analytics'],
['STaaS','Storage','Object Storage Service (OSS)','พื้นที่จัดเก็บข้อมูลแบบ Object','เก็บไฟล์เป็น Object ใน Bucket เข้าถึงผ่าน API/URL','เก็บรูป วิดีโอ สำรองข้อมูล','ขยายพื้นที่ได้แทบไม่จำกัด','App → Bucket → Objects'],
['Big Data & Analytics','Data','MaxCompute / Realtime Compute for Apache Flink','บริการประมวลผลและวิเคราะห์ข้อมูลปริมาณมาก','รวบรวมข้อมูล ประมวลผลแบบ Batch/Stream แล้วสรุปเป็นรายงาน','วิเคราะห์พฤติกรรมผู้ใช้','ประมวลผลข้อมูลขนาดใหญ่ได้','Data Source → Processing → Report'],
['BCaaS','Blockchain','Blockchain as a Service','บริการสร้างและจัดการเครือข่าย Blockchain บนคลาวด์','ผู้ให้บริการจัดเตรียมโหนดและเครื่องมือจัดการ — ตรวจสอบสถานะบริการปัจจุบันก่อนใช้งาน','ติดตามที่มาสินค้า (ตัวอย่างเชิงแนวคิด)','ลดภาระตั้งค่าโครงสร้างเอง','Participants → Nodes → Ledger'],
['LBaaS','Networking','Server Load Balancer (SLB)','กระจายทราฟฟิกไปยังหลายเซิร์ฟเวอร์','รับคำขอที่จุดเดียวแล้วส่งต่อไปยังเซิร์ฟเวอร์ที่พร้อม','เว็บที่มีผู้ใช้จำนวนมาก','ลดจุดล้มเหลว เพิ่มความพร้อมใช้งาน','Users → Load Balancer → Servers']];
const A=[['USER','ผู้ใช้ส่งคำขอผ่านเว็บ/แอป'],['NETWORK','คำขอเดินทางผ่านเครือข่ายและ CDN'],['LOAD BALANCER','กระจายคำขอไปยังเซิร์ฟเวอร์ — SLB'],['COMPUTE','ประมวลผลตรรกะแอป — ECS/ACK/Function Compute'],['DATABASE','อ่าน/เขียนข้อมูล — ApsaraDB'],['STORAGE','เก็บไฟล์และข้อมูล — OSS'],['AI / ANALYTICS','วิเคราะห์หรือใช้โมเดล AI สร้างผลลัพธ์']];
const C=[['E-Commerce','User → Network → Compute → Database → Storage → Analytics'],['AI Application','User → Application → AI → Data → Result'],['IoT','Device → Network → Cloud → Data → Analytics']];
const R=[['Hangzhou (จีน)',120.2,30.3],['Beijing (จีน)',116.4,39.9],['Shanghai (จีน)',121.5,31.2],['Shenzhen (จีน)',114.1,22.5],['Hong Kong',114.2,22.3],['Singapore',103.8,1.35],['Tokyo (ญี่ปุ่น)',139.7,35.7],['Silicon Valley (สหรัฐฯ)',-122,37.4],['Virginia (สหรัฐฯ)',-77.5,38.9],['Frankfurt (เยอรมนี)',8.7,50.1],['London (สหราชอาณาจักร)',-0.1,51.5],['Dubai (UAE)',55.3,25.2]];
const P=[['FOUNDATION','ระดับพื้นฐาน','แนวคิด Cloud เบื้องต้น','ผู้เริ่มต้น','ตรวจสอบหลักสูตรพื้นฐานที่เปิดอยู่ในหน้า Certification ทางการ'],['ASSOCIATE','ระดับกลาง (เช่น ACA)','พื้นฐานการใช้งานผลิตภัณฑ์ เช่น Compute/Storage','นักศึกษา/ผู้ดูแลระบบใหม่','ตรวจสอบรหัสข้อสอบล่าสุดที่หน้าทางการ'],['PROFESSIONAL','ระดับสูง (เช่น ACP)','ออกแบบและปฏิบัติการสถาปัตยกรรมจริง','วิศวกร Cloud ที่มีประสบการณ์','ตรวจสอบสาขาและข้อสอบที่เปิดสอบปัจจุบัน']];
const U=[['Compute',9],['Storage',6],['Database',8],['Network',4]];

/* Nav / progress / theme */
const nav=$('#menu'),bg=$('#burger');
bg.onclick=()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)};
nav.addEventListener('click',e=>{if(e.target.tagName==='A')nav.classList.remove('open')});
$('#theme').onclick=()=>{const d=document.documentElement;d.dataset.theme=d.dataset.theme==='dark'?'light':'dark'};
$('#top').onclick=()=>scrollTo({top:0});
addEventListener('scroll',()=>{const h=document.documentElement,p=scrollY/(h.scrollHeight-innerHeight);$('#progress').style.width=p*100+'%';$('#top').classList.toggle('show',scrollY>600)},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

/* Service universe + panel */
const panel=$('#panel');let last;
function open(i){const s=S[i];last=document.activeElement;$('#pTag').textContent=s[1].toUpperCase();$('#pTitle').textContent=s[0]+' — '+s[2];
$('#pBody').innerHTML=`<h5>What is it?</h5><p>${s[3]}</p><h5>How it works</h5><p>${s[4]}</p><h5>Use case</h5><p>${s[5]}</p><h5>Key benefits</h5><p>${s[6]}</p><h5>Example architecture</h5><p>${s[7]}</p><p><small>ชื่อบริการอาจเปลี่ยนแปลง โปรดตรวจสอบเอกสารทางการ</small></p>`;
panel.hidden=false;requestAnimationFrame(()=>panel.classList.add('open'));$('#pClose').focus()}
function close(){panel.classList.remove('open');setTimeout(()=>panel.hidden=true,400);last&&last.focus()}
$('#pClose').onclick=close;addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))close()});
const uni=$('#universe');
S.forEach((s,i)=>{const b=document.createElement('button');b.className='node';b.innerHTML=`<b>${s[0]}</b><small>${s[1]}</small>`;
const a=i/S.length*2*Math.PI-Math.PI/2;b.style.cssText=`--x:${50+42*Math.cos(a)}%;--y:${50+43*Math.sin(a)}%`;b.dataset.a=a;b.onclick=()=>open(i);uni.appendChild(b)});
function place(){const w=matchMedia('(min-width:900px)').matches;$$('.node').forEach(n=>{if(w){const a=+n.dataset.a;n.style.left=50+40*Math.cos(a)+'%';n.style.top=50+42*Math.sin(a)+'%'}else{n.style.left=n.style.top=''}})}
place();addEventListener('resize',place);

/* Architecture + data flow */
const arch=$('#arch'),info=$('#archInfo');let cur=0,sel=-1;
A.forEach((a,i)=>{const b=document.createElement('button');b.className='an';b.textContent=a[0];b.onclick=()=>{sel=i;$$('.an').forEach((n,j)=>n.classList.toggle('sel',j===i));info.innerHTML=`<b>${a[0]}</b> — ${a[1]}`};arch.appendChild(b);
if(i<A.length-1){const r=document.createElement('span');r.className='ar';r.textContent='→';r.setAttribute('aria-hidden','true');arch.appendChild(r)}});
info.textContent='เลือก Node เพื่อดูคำอธิบาย';
if(!reduce)setInterval(()=>{$$('.an').forEach((n,j)=>n.classList.toggle('on',j===cur));cur=(cur+1)%A.length},1100);

/* Cases */
$('#cases').innerHTML=C.map(c=>`<div class="case"><h4>${c[0]}</h4><p>${c[1]}</p></div>`).join('')+'<p class="note" style="grid-column:1/-1">ตัวอย่างเพื่อการเรียนรู้ ไม่ได้อ้างอิงบริษัทจริง</p>';

/* Map */
const map=$('#map'),NS='http://www.w3.org/2000/svg',xy=(lo,la)=>[(lo+180)/3.6,(90-la)/3.6];
const hz=xy(R[0][1],R[0][2]);
R.forEach((r,i)=>{const [x,y]=xy(r[1],r[2]);if(i){const l=document.createElementNS(NS,'line');l.setAttribute('x1',hz[0]);l.setAttribute('y1',hz[1]);l.setAttribute('x2',x);l.setAttribute('y2',y);l.setAttribute('class','ln');map.appendChild(l)}});
R.forEach((r,i)=>{const [x,y]=xy(r[1],r[2]);const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',1.1);c.setAttribute('class','pt');c.setAttribute('tabindex','0');c.setAttribute('role','button');c.setAttribute('aria-label',r[0]);
const f=()=>{$$('.pt').forEach(p=>p.classList.remove('sel'));c.classList.add('sel');$('#mapInfo').innerHTML=`<b>${r[0]}</b><br>Region ตัวอย่างในโครงข่าย Alibaba Cloud — แต่ละ Region ประกอบด้วย Availability Zone หลายแห่ง ตรวจสอบรายละเอียดและบริการที่รองรับที่หน้า Global Infrastructure ทางการ`};
c.onclick=f;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}};map.appendChild(c)});

/* Cost simulation */
const chips=$('#chips'),bars=$('#bars'),on=new Set(U.map(u=>u[0]));
U.forEach(u=>{const b=document.createElement('button');b.className='chip';b.textContent=u[0];b.setAttribute('aria-pressed','true');b.onclick=()=>{on.has(u[0])?on.delete(u[0]):on.add(u[0]);b.setAttribute('aria-pressed',on.has(u[0]));draw()};chips.appendChild(b)});
function draw(){const t=U.filter(u=>on.has(u[0])).reduce((a,u)=>a+u[1],0);bars.innerHTML=U.map(u=>{const p=on.has(u[0])&&t?Math.round(u[1]/t*100):0;return`<div class="bar"><small>${u[0]} — ${p}% (จำลอง)</small><i style="width:${p}%"></i></div>`}).join('')}
draw();

/* Certification */
const path=$('#path');
P.forEach((p,i)=>{const b=document.createElement('button');b.className='pn';b.innerHTML=`<b>${p[0]}</b><br>${p[1]}`;b.onclick=()=>{$$('.pn').forEach(n=>n.classList.remove('sel'));b.classList.add('sel');$('#pathInfo').innerHTML=`<b>${p[0]}</b><br>Level: ${p[1]}<br>Skills: ${p[2]}<br>Target: ${p[3]}<br>Related exam: ${p[4]}`};path.appendChild(b);if(i<2){const a=document.createElement('div');a.className='pa';a.textContent='↓';path.appendChild(a)}});
$('#pathInfo').textContent='เลือกระดับเพื่อดูรายละเอียด';

/* Canvas network (hero + ending) */
function net(cv,n,fade){const x=cv.getContext('2d');let w,h,pts,vis=true;
const rs=()=>{w=cv.width=cv.offsetWidth;h=cv.height=cv.offsetHeight;pts=[...Array(n)].map(()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,c:Math.random()<.3?'#FF3A2F':'#00E5FF'}))};
rs();addEventListener('resize',rs);
new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis)loop()}).observe(cv);
function loop(){if(!vis)return;x.clearRect(0,0,w,h);const k=fade?Math.max(0,1-Math.max(0,(cv.getBoundingClientRect().top<0?0:(innerHeight-cv.getBoundingClientRect().top)/innerHeight)-.4)*1.2):1;
pts.forEach(p=>{if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1}x.globalAlpha=.7*k;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,1.6,0,7);x.fill()});
for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<130){x.globalAlpha=(1-d/130)*.35*k;x.strokeStyle='#00E5FF';x.beginPath();x.moveTo(pts[i].x,pts[i].y);x.lineTo(pts[j].x,pts[j].y);x.stroke()}}
if(!reduce)requestAnimationFrame(loop)}
loop()}
const n=lowEnd?35:70;net($('#heroCanvas'),n,false);net($('#endCanvas'),Math.round(n/2),true);

/* Active nav link */
const links=$$('nav a');const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('section[id]').forEach(s=>so.observe(s));
})();
