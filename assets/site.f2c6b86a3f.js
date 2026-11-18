/* CONFIG, ANNOUNCEMENT, CALC and ROUTES are injected by the build from site.config.mjs */
const CONFIG = {"leadEndpoint":"","calendlyUrl":"","salesEmail":""};
const ANNOUNCEMENT = {"enabled":true,"id":"midwinter-2027","tag":"Event","text":"Meet us at the Chicago Dental Society Midwinter Meeting, Feb 25–27, 2027, McCormick Place West.","until":"2027-02-27","linkText":"","action":"demo"};
const CALC = {"automationShare":50,"hourlyCost":28,"weeks":48};
const ROUTES = {"home":"/","ai-dental-billing":"/ai-dental-billing","features":"/features","why-mitsuha":"/why-mitsuha","why-mitsuha-dentrix":"/why-mitsuha/dentrix","why-mitsuha-eaglesoft":"/why-mitsuha/eaglesoft","why-mitsuha-open-dental":"/why-mitsuha/open-dental","about":"/about","faq":"/faq","demo":"/demo","compare-dentrix-alternative":"/compare/dentrix-alternative","compare-archy-alternative":"/compare/archy-alternative","for-small-practices":"/for/small-practices","why-switch":"/why-mitsuha","why-switch-dentrix":"/why-mitsuha/dentrix","why-switch-eaglesoft":"/why-mitsuha/eaglesoft","why-switch-open-dental":"/why-mitsuha/open-dental"};

const PAGE = document.body.dataset.page || "home";
function route(){ return PAGE }

/* ===== storage helpers ===== */
const store = { get(k){ try{return localStorage.getItem(k)}catch(e){return null} }, set(k,v){ try{localStorage.setItem(k,v)}catch(e){} }, del(k){ try{localStorage.removeItem(k)}catch(e){} } };

/* ===== Tracking ===== */
window.dataLayer = window.dataLayer || [];
function track(event, data){ window.dataLayer.push(Object.assign({event}, data||{})); }
const UTM_KEYS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"];
function getUtms(){
  let saved = {};
  try{ saved = JSON.parse(sessionStorage.getItem("mitsuha_utm")||"{}") }catch(e){}
  try{
    const q = new URLSearchParams(location.search); let found=false; const fresh={};
    UTM_KEYS.forEach(k=>{ if(q.get(k)){ fresh[k]=q.get(k); found=true } });
    if(found && !Object.keys(saved).length){ saved=fresh; try{sessionStorage.setItem("mitsuha_utm",JSON.stringify(saved))}catch(e){} }
  }catch(e){}
  return saved;
}
const UTMS = getUtms();

/* ===== Icons ===== */
const P = {phone:'<path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>',mobile:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8v.1"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  users:'<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19c.6-3 3-4.8 5.5-4.8s4.9 1.8 5.5 4.8"/><circle cx="17" cy="8" r="2.4"/><path d="M16 13.6c2.3.1 4 1.6 4.5 4.4"/>',
  billing:'<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  shield:'<path d="M12 3l7.5 3.2v5.3c0 4.6-3.2 7.9-7.5 9.2-4.3-1.3-7.5-4.6-7.5-9.2V6.2z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/>',
  chart:'<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  tooth:'<path d="M12 5.2C10.4 3.6 6 3 5.2 6.4c-.6 2.6.6 5 1.2 7.4.5 2.2.8 6.2 2.2 6.2 1.6 0 1.4-4.6 3.4-4.6s1.8 4.6 3.4 4.6c1.4 0 1.7-4 2.2-6.2.6-2.4 1.8-4.8 1.2-7.4C18 3 13.6 3.6 12 5.2z"/>',
  message:'<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5z"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  cloud:'<path d="M7 18.5a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.8 3.8 0 0 1 17.5 18.5z"/>',
  arrow:'<path d="M4 12h14M13 6l6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  doc:'<path d="M6.5 3.5h7l4 4v13h-11z"/><path d="M13.5 3.5v4h4M9 12h6M9 16h6"/>',
  xray:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M8 10c0-1.5 1-2.5 2-2.5s1.2.8 2 .8 1-.8 2-.8 2 1 2 2.5M8 14c0 1.5 1 2.5 2 2.5s1.2-.8 2-.8 1 .8 2 .8 2-1 2-2.5"/>'
};
const icon = (n,s=20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||""}</svg>`;
document.querySelectorAll("[data-ico]").forEach(el=>{ el.innerHTML = icon(el.dataset.ico, el.closest(".tour-tabs")?16:20) });

/* ===== Mock screens (sample data; placeholders for real screenshots) ===== */
const NAV = [["calendar","Schedule"],["users","Patients"],["billing","Billing"],["shield","Insurance"],["message","Messages"],["chart","Reports"]];
const shell = (path, title, sub, on, inner) => `
  <div class="app-top"><span class="tl"><i></i><i></i><i></i></span><span class="url">app.mitsuha.com/${path}</span><span style="width:46px"></span></div>
  <div class="app-body">
    <nav class="app-nav" aria-hidden="true"><div class="brand"><i></i><span>Mitsuha</span></div>${NAV.map(([ic,l],i)=>`<a class="${i===on?'on':''}">${icon(ic,14)}<span>${l}</span></a>`).join("")}</nav>
    <div class="app-main">
      <div class="app-head"><h4>${title}</h4><span class="search">Search patients…</span><span class="av">DH</span></div>
      ${sub?`<p class="app-sub">${sub}</p>`:""}
      ${inner}
    </div>
  </div><span class="sample">Sample data</span>`;
const times = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30"];
const SCREENS = {
  schedule: () => shell("schedule","Today's schedule","Tue, Mar 3 · Lakeside office · 24 patients",0, `
    <div class="sched">
      <div></div><div class="col-h">Dr. Hansen</div><div class="col-h">Dr. Moua</div><div class="col-h">Hygiene</div>
      ${times.map((t,i)=>`<div class="t">${t}</div><div class="slot">${i===0?'<div class="appt">J. Lee · Crown prep</div>':i===3?'<div class="appt">R. Patel · Filling</div>':i===6?'<div class="appt">T. Berg · Consult</div>':''}</div><div class="slot">${i===1?'<div class="appt n">New patient · Exam</div>':i===4?'<div class="appt">D. Park · Root canal</div>':''}</div><div class="slot">${[0,2,5,7].includes(i)?`<div class="appt h">${{0:"M. Ortiz",2:"A. Novak",5:"S. Brooks",7:"L. Vang"}[i]} · Cleaning</div>`:''}</div>`).join("")}
    </div>`),
  billing: () => shell("billing","AI billing","This week · all offices",2, `
    <div class="tiles"><div class="tile"><span>Claims sent</span><b>128</b><small>Automated</small></div><div class="tile"><span>Paid</span><b>104</b><small>$48,310</small></div><div class="tile"><span>Needs attention</span><b style="color:var(--warn)">6</b></div></div>
    <div class="rows">
      <div class="r"><span>Patient</span><span>Payer</span><span>Amount</span><span>Status</span></div>
      <div class="r"><span>J. Lee · D2740</span><span>Sample PPO</span><span>$1,180</span><span class="pill p-ok">Paid</span></div>
      <div class="r"><span>M. Ortiz · D1110</span><span>Sample Dental</span><span>$142</span><span class="pill p-info">Sent</span></div>
      <div class="r"><span>D. Park · D3330</span><span>Sample PPO</span><span>$960</span><span class="pill p-warn">X-ray needed</span></div>
      <div class="r"><span>A. Novak · D0120</span><span>Sample Mutual</span><span>$64</span><span class="pill p-ok">Paid</span></div>
      <div class="r"><span>R. Patel · D2392</span><span>Sample Dental</span><span>$215</span><span class="pill p-info">Follow-up sent</span></div>
    </div>`),
  insurance: () => shell("insurance/ortiz","Insurance check","Checked automatically at 7:02 AM",3, `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><b style="font-size:.88rem">Maya Ortiz</b><div style="color:var(--muted)">Sample PPO · Member ID ••••4821</div></div><span class="pill p-ok">Active coverage</span></div>
    <div class="tiles"><div class="tile"><span>Preventive</span><b>100%</b></div><div class="tile"><span>Basic</span><b>80%</b></div><div class="tile"><span>Major</span><b>50%</b></div></div>
    <div class="kv"><span>Deductible</span><span>$50 · met</span><span>Annual max remaining</span><span>$1,150 of $1,500</span><span>Last cleaning</span><span>Sep 4</span><span>Frequency</span><span>2 per year · eligible</span><span>Waiting periods</span><span>None</span></div>`),
  chart: () => { const up=[...Array(16)].map((_,i)=>i+1), lo=[...Array(16)].map((_,i)=>32-i);
    const cls=n=>[3,14,30].includes(n)?"tx":[19,8,12].includes(n)?"ex":[1,16,17,32].includes(n)?"mi":"";
    return shell("patients/lee/chart","Jordan Lee","Age 46 · Last visit Feb 10",1, `
    <div class="teeth">${up.map(n=>`<div class="tooth ${cls(n)}">${n}</div>`).join("")}</div>
    <div class="teeth">${lo.map(n=>`<div class="tooth ${cls(n)}">${n}</div>`).join("")}</div>
    <div class="legend"><span><i style="background:#FDEBD3;border:1px solid #E2A65A"></i>Planned</span><span><i style="background:#DDF0F2;border:1px solid var(--teal)"></i>Existing</span><span><i style="background:#eee"></i>Missing</span></div>
    <div class="rows"><div class="r"><span>Treatment plan</span><span>Tooth</span><span>Fee</span><span>Est. ins.</span></div><div class="r"><span>Crown, porcelain</span><span>#3</span><span>$1,180</span><span>$590</span></div><div class="r"><span>Filling, 2 surface</span><span>#14</span><span>$215</span><span>$172</span></div></div>`)},
  reports: () => { const h=[62,70,66,78,74,88]; const m=["Oct","Nov","Dec","Jan","Feb","Mar"];
    return shell("reports","Practice dashboard","All offices · last 6 months",5, `
    <div class="tiles"><div class="tile"><span>Collections, Mar</span><b>$184,200</b><small>+6.1%</small></div><div class="tile"><span>Collection rate</span><b>97.4%</b></div><div class="tile"><span>Claims sent</span><b>412</b></div></div>
    <div><div style="color:var(--muted);margin-bottom:6px">Monthly collections</div><div class="bars">${h.map((v,i)=>`<div class="${i===5?'cur':''}" style="height:${v}%"></div>`).join("")}</div><div class="bar-labels">${m.map(x=>`<span>${x}</span>`).join("")}</div></div>`)},
  messages: () => `<div class="app-body" style="flex-direction:column">
    <div style="padding:30px 14px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px"><span class="av" style="width:30px;height:30px;border-radius:50%;background:var(--mint);display:grid;place-items:center;font-weight:700;font-size:.65rem;color:var(--teal-deep)">MO</span><span><b style="font-size:.8rem">Maya Ortiz</b><br><span style="color:var(--muted);font-size:.64rem">Lakeside office</span></span></div>
    <div class="app-main" style="gap:8px;justify-content:flex-end">
      <div style="color:var(--muted);text-align:center;font-size:.62rem">Today</div>
      <div class="msg out">Hi Maya, this is Lakeside Dental. Reminder: your cleaning is Thu at 9:00 AM. Reply C to confirm or R to reschedule.</div>
      <div class="msg in">C</div>
      <div class="msg out">Thanks, you're confirmed for Thu at 9:00 AM. See you then!</div>
      <div class="msg in">Can I park in the back lot?</div>
      <div class="msg out">Yes, the back lot is open for patients.</div>
      <div style="border:1px solid var(--border);border-radius:999px;padding:7px 12px;color:var(--muted);margin-top:6px">Type a message…</div>
    </div></div><span class="sample" style="bottom:auto;top:30px">Sample data</span>`
};
function renderScreens(root){ root.querySelectorAll("[data-screen]").forEach(el=>{ el.classList.add("app"); el.innerHTML = SCREENS[el.dataset.screen]() }) }

/* ===== Product tour ===== */
const TOUR = {
  schedule:["Schedule","Every chair, provider and hygienist in one view, with insurance status on each appointment.",["Multi-office view","Drag to reschedule","Open-slot finder"]],
  billing:["AI billing","Claims sent, paid and flagged in one list. Your team only works the claims marked for attention.",["Claims built from the chart","Automatic follow-up","One list of exceptions"]],
  insurance:["Insurance","Coverage checked before the patient arrives, with deductibles, maximums and frequencies spelled out.",["Checked before each visit","Coverage by category","Flags for problem plans"]],
  chart:["Charts","A clear tooth chart with existing work and planned treatment, plus insurance estimates on the plan.",["Tooth chart","Treatment plans","Clinical notes"]],
  reports:["Reports","Collections, production and collection rate, for one office or all of them.",["Collections and production","Collection rate","Per office or group"]]
};
function setTour(key, focus){
  if(!document.getElementById("tourPanel")) return;
  document.querySelectorAll("[data-tour]").forEach(b=>{ const on=b.dataset.tour===key; b.setAttribute("aria-selected",on); b.tabIndex=on?0:-1; if(on&&focus) b.focus() });
  document.getElementById("tourPanel").setAttribute("aria-labelledby","tab-"+key);
  const [t,d,pts] = TOUR[key];
  document.getElementById("tourCopy").innerHTML = `<h3>${t}</h3><p class="lede">${d}</p><ul class="checks">${pts.map(p=>`<li>${p}</li>`).join("")}</ul><div><a class="text-link" href="/features">See all features <span class="arr" aria-hidden="true">→</span></a></div>`;
  document.getElementById("tourScreen").innerHTML = `<div class="app">${SCREENS[key]()}</div>`;
}
document.querySelectorAll("[data-tour]").forEach(b=>b.addEventListener("click",()=>setTour(b.dataset.tour)));
document.querySelector(".tour-tabs")?.addEventListener("keydown",e=>{
  const keys=Object.keys(TOUR); const cur=keys.indexOf(document.querySelector('[data-tour][aria-selected="true"]').dataset.tour);
  if(e.key==="ArrowRight"){e.preventDefault();setTour(keys[(cur+1)%keys.length],true)}
  if(e.key==="ArrowLeft"){e.preventDefault();setTour(keys[(cur+keys.length-1)%keys.length],true)}
});

/* ===== FAQ content (single source: src/data/content.mjs; injected by the build for the chat widget) ===== */
const ph = t => `<span class="ph">${t}</span>`;
const FAQ = {"Cost":[["How much does dental practice management software cost?","<p>You can get a custom pricing quote by booking a 20-minute demo right on this page. Simply share a few quick details about your dental practice—including your number of locations, active providers, and current practice management software—and select a time that works for your team.</p><p>During the call, we will walk you through a personalized workflow tailored to a practice like yours and provide transparent, all-in pricing covering your monthly subscription, data migration, and onboarding.</p>"]],"Switching":[["How long does it take to switch dental software?","<p>Most dental practices go live within 3 to 4 weeks after signing, with the majority of that timeline driven by standard electronic insurance billing and clearinghouse paperwork.</p><p>During your onboarding window, our implementation team locks in your target go-live date, audits and migrates your patient data, and delivers role-based training for your front desk, hygienists, assistants, and doctors—ensuring your entire team feels confident before day one.</p>"],["What data can I bring over from my current software?","<p>What transfers into Mitsuha depends on whether you are opening a new dental practice or migrating from an existing practice management system—and our onboarding team reviews your exact database with you step by step before you switch:</p><ul><li><b>New dental startups:</b> If you are launching a brand-new office with no legacy database, setup is fast and straightforward—we configure your schedules, fee schedules, and digital intake forms from scratch.</li><li><b>Established practices switching software:</b> Before your go-live date, we audit your current system together and map out a clear conversion plan. Depending on your existing software, migration typically covers core records such as patient demographics, clinical charts, digital X-rays, insurance details, and account ledgers.</li></ul><p>Because every legacy database is structured differently, you will receive a transparent breakdown of exactly what moves over—and how historical records are handled—well before your go-live date.</p>"],["Does Mitsuha work with my imaging sensors?","<p>Yes. Mitsuha includes built-in, native dental imaging software, eliminating the need to license or bridge a separate third-party imaging program. It connects directly to intraoral X-ray sensors and panoramic X-ray machines that support standard TWAIN drivers, saving captured images straight into the patient’s digital chart and corresponding tooth.</p><p>Because certain hardware models require minor driver configuration, our implementation team audits and tests your exact imaging setup with you prior to go-live.</p>"]],"Security":[["Is cloud dental software HIPAA compliant?","<p>Yes—cloud-based dental practice management software is HIPAA compliant when the vendor implements required administrative, physical, and technical safeguards to protect Electronic Protected Health Information (ePHI) and executes a formal Business Associate Agreement (BAA) with the dental practice.</p><p>Mitsuha meets strict HIPAA compliance standards—using encrypted data transmission, secure cloud infrastructure, and role-based user permissions—and signs a BAA with every dental practice before onboarding.</p>"],["Do I need a server in my office?","<p>No on-premise server is required. Because Mitsuha is cloud-based dental practice management software, your practice avoids the upfront hardware costs, local server backups, and ongoing IT maintenance tied to traditional server-based systems. Your team logs in directly through a web browser on your existing office computers to access real-time schedules, clinical charts, and billing across any location—without VPN lag—while new features and security updates arrive automatically without downtime.</p>"]],"AI billing":[["What is AI dental billing?","<p>AI dental billing is practice management software that automates repetitive dental insurance and revenue cycle workflows—including real-time insurance eligibility verification, building clean claims directly from completed CDT procedures, electronic claim submission, ERA payment posting, and automated follow-up on unpaid or aging claims.</p><p>Instead of manually chasing payers for every visit, Mitsuha’s AI dental billing handles routine claim processing in the background and flags only the exceptions that genuinely require human review—helping practices accelerate reimbursements and reduce claim denials. Explore the full workflow on our <a href=\"/ai-dental-billing\">AI Dental Billing page</a>.</p>"]],"Training and support":[["What training and support do you provide—from onboarding onward?","<p>Mitsuha combines hands-on onboarding with built-in in-app guidance and ongoing support so your team is supported before launch, on day one, and as you grow:</p><ul><li><b>Role-based pre-go-live onboarding:</b> Before you switch, our team walks each role in your office—front desk, billing, hygiene, assistants, and doctors—through tailored training sessions so everyone knows their daily workflows before launch.</li><li><b>On-demand guidance with Ask Megumi:</b> Inside the software, Ask Megumi gives your staff and future new hires instant, plain-language answers and interactive step-by-step walkthroughs across clinical charting, scheduling, imaging, and billing—without pulling senior staff away from patients.</li><li><b>Ongoing support &amp; in-app chat:</b> After go-live, your team can reach us anytime through our built-in support and feedback chat right inside Mitsuha.</li></ul>"]]};

/* Comparison pages are rendered to static HTML at build time (src/data/content.mjs). */

/* ===== Calculator ===== */
if(document.getElementById("c-share")) ["share","rate","weeks"].forEach((k,i)=>{ document.getElementById("c-"+k).value = [CALC.automationShare,CALC.hourlyCost,CALC.weeks][i] });
let shownH=0, shownD=0, raf;
function calc(){
  const v = id => Math.max(0, parseFloat(document.getElementById(id).value)||0);
  ["offices","staff","hours"].forEach(k=>document.getElementById("o-"+k).textContent=document.getElementById("c-"+k).value);
  const hours = Math.round(v("c-offices")*v("c-staff")*v("c-hours")*(Math.min(100,v("c-share"))/100)*Math.min(52,v("c-weeks")));
  animateTo(hours, Math.round(hours*v("c-rate")));
}
function animateTo(h,d){
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const eh=document.getElementById("r-hours"), ed=document.getElementById("r-dollars");
  cancelAnimationFrame(raf);
  if(reduce || (!shownH && !shownD && document.hidden)){ shownH=h; shownD=d; eh.textContent=h.toLocaleString(); ed.textContent="$"+d.toLocaleString(); return }
  const h0=shownH,d0=shownD,t0=performance.now();
  const step=t=>{ const p=Math.min(1,(t-t0)/450), e=1-Math.pow(1-p,3); shownH=Math.round(h0+(h-h0)*e); shownD=Math.round(d0+(d-d0)*e); eh.textContent=shownH.toLocaleString(); ed.textContent="$"+shownD.toLocaleString(); if(p<1) raf=requestAnimationFrame(step) };
  raf=requestAnimationFrame(step);
}
document.querySelectorAll(".calc input").forEach(i=>i.addEventListener("input",calc));

/* ===== Demo form ===== */
const STATES = ["Minnesota","Iowa","Wisconsin","Illinois","North Dakota","South Dakota","Michigan","Indiana","Ohio","Missouri","Nebraska","Kansas","Other state"];
function formHTML(p){
  return `<div class="modal-head"><h2 id="${p}Title" style="font-size:1.75rem">Book a 20-minute demo</h2><p class="muted">Tell us about your practice, then pick a time with our team.</p></div>
  <form class="demo-form" novalidate>
    <div class="field"><label for="${p}-first">First name</label><input id="${p}-first" name="first_name" autocomplete="given-name" required></div>
    <div class="field"><label for="${p}-last">Last name</label><input id="${p}-last" name="last_name" autocomplete="family-name" required></div>
    <div class="field"><label for="${p}-email">Work email</label><input id="${p}-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="${p}-phone">Phone <span class="opt">(optional)</span></label><input id="${p}-phone" name="phone" type="tel" autocomplete="tel"></div>
    <div class="field full"><label for="${p}-practice">Practice name</label><input id="${p}-practice" name="practice" autocomplete="organization" required></div>
    <div class="field"><label for="${p}-role">Your role</label><select id="${p}-role" name="role" required><option value="">Choose one</option><option>Owner dentist</option><option>Office manager</option><option>Other</option></select></div>
    <div class="field"><label for="${p}-offices">Number of offices</label><select id="${p}-offices" name="offices" required><option value="">Choose one</option><option>1</option><option>2–3</option><option>4–10</option><option>11+</option></select></div>
    <div class="field"><label for="${p}-software">Current software</label><select id="${p}-software" name="current_software" required><option value="">Choose one</option><option>Dentrix</option><option>Eaglesoft</option><option>Open Dental</option><option>Other</option></select></div>
    <div class="field"><label for="${p}-state">State</label><select id="${p}-state" name="state" required><option value="">Choose one</option>${STATES.map(s=>`<option>${s}</option>`).join("")}</select></div>
    ${UTM_KEYS.map(k=>`<input type="hidden" name="${k}" value="${(UTMS[k]||"").replace(/"/g,"&quot;")}">`).join("")}
    <input type="hidden" name="page_url" value="">
    <div class="hp" aria-hidden="true"><label for="${p}-company_site">Leave this empty</label><input id="${p}-company_site" name="company_site" tabindex="-1" autocomplete="off"></div>
    <label class="check full" for="${p}-optin"><input type="checkbox" id="${p}-optin" name="marketing_opt_in"> Send me tips and updates</label>
    <p class="no-phi full"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" stroke-width="2" aria-hidden="true"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg>Please don't enter patient information.</p>
    <p class="err full" role="alert" hidden></p>
    <div class="full"><button type="submit" class="btn btn-primary" style="width:100%">Continue to pick a time <span class="arr" aria-hidden="true">→</span></button></div>
  </form>`;
}
let currentLead = null, lastFocus = null, demoSource = "";
function bindForm(container){
  const form = container.querySelector("form");
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const fd = new FormData(form); let ok = true;
    form.querySelectorAll("[required]").forEach(inp=>{ const bad = !inp.value.trim() || (inp.type==="email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)); inp.closest(".field").classList.toggle("invalid",bad); inp.setAttribute("aria-invalid",bad); if(bad) ok=false });
    const err = form.querySelector(".err");
    if(!ok){ err.textContent="Please fill in the highlighted fields. Work email needs a full address, like name@practice.com."; err.hidden=false; form.querySelector('[aria-invalid="true"]').focus(); return }
    err.hidden=true;
    if(fd.get("company_site")) return;
    fd.set("page_url", location.pathname);
    currentLead = Object.fromEntries(fd.entries()); delete currentLead.company_site;
    currentLead.demo_source = demoSource || "demo-page";
    sendLead(container, form);
  });
}
async function sendLead(container, form){
  const btn = form.querySelector('[type="submit"]'), err = form.querySelector(".err");
  btn.disabled = true; btn.style.opacity = .6;
  let ok = false;
  if(CONFIG.leadEndpoint){
    try{ const r = await fetch(CONFIG.leadEndpoint, {method:"POST", headers:{"Content-Type":"application/json", "Accept":"application/json"}, body: JSON.stringify(currentLead)}); ok = r.ok }catch(e){ ok = false }
  }
  btn.disabled = false; btn.style.opacity = "";
  if(!ok){
    err.innerHTML = "Sorry, we couldn't send your details just now. Please try again" + (CONFIG.salesEmail ? `, or email us at <a href="mailto:${esc(CONFIG.salesEmail)}">${esc(CONFIG.salesEmail)}</a>.` : ".");
    err.hidden = false; track("demo_form_error", {source: currentLead.demo_source}); return;
  }
  track("demo_form_submit", {source: currentLead.demo_source});
  showCalendly(container);
}
let calendlyLoad = null;
function loadCalendly(){
  if(!calendlyLoad) calendlyLoad = new Promise((res, rej)=>{ const s = document.createElement("script"); s.src = "https://assets.calendly.com/assets/external/widget.js"; s.async = true; s.onload = res; s.onerror = rej; document.head.appendChild(s) });
  return calendlyLoad;
}
function showCalendly(container){
  if(!/^https:\/\/calendly\.com\//.test(CONFIG.calendlyUrl || "")){ showDone(container, false); return }
  container.innerHTML = `<div class="modal-head"><h2 style="font-size:1.6rem">Pick a time for your demo</h2><p class="muted">20 minutes with our team. Times shown in your time zone.</p></div><div class="cal-embed"></div><p class="small muted">Not ready to pick a time? You can close this. We'll follow up by email.</p>`;
  const h = container.querySelector("h2"); h.setAttribute("tabindex","-1"); h.focus();
  const utm = {utmSource:UTMS.utm_source, utmMedium:UTMS.utm_medium, utmCampaign:UTMS.utm_campaign, utmContent:UTMS.utm_content, utmTerm:UTMS.utm_term};
  loadCalendly().then(()=>{
    window.Calendly.initInlineWidget({url: CONFIG.calendlyUrl, parentElement: container.querySelector(".cal-embed"), prefill:{name: `${currentLead.first_name} ${currentLead.last_name}`, email: currentLead.email}, utm});
  }).catch(()=>showDone(container, false));
  const onMsg = e=>{
    if(e.origin !== "https://calendly.com" || !e.data || e.data.event !== "calendly.event_scheduled") return;
    window.removeEventListener("message", onMsg);
    track("demo_booked", {source: currentLead.demo_source}); showDone(container, true);
  };
  window.addEventListener("message", onMsg);
}
function showDone(container, booked){
  container.innerHTML = `<div class="done"><div class="tick"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" stroke-width="2.5" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg></div>
  <h2 tabindex="-1" style="font-size:1.75rem">${booked ? "You're booked" : "Thanks, we have your details"}</h2>
  <p class="muted">${booked ? `A calendar invite is on its way to ${esc(currentLead.email)}.` : `Our team will email ${esc(currentLead.email)} to set up a time.`} Here's what happens next:</p>
  <ul class="checks"><li>A short email from our team with a few questions about your practice</li><li>A 20-minute demo built around your day: schedule, charting and AI billing</li><li>Time for your questions about switching from ${esc(currentLead.current_software)}</li></ul></div>`;
  container.querySelector("h2").focus();
}
function esc(s){ return String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])) }

const modal = document.getElementById("demoModal"), modalBody = document.getElementById("modalBody");
function openDemo(source){
  demoSource = source; lastFocus = document.activeElement;
  track("demo_button_click",{source});
  modalBody.innerHTML = formHTML("m"); bindForm(modalBody);
  modal.hidden = false; document.body.style.overflow="hidden";
  closeMenus();
  setTimeout(()=>document.getElementById("m-first").focus(),30);
}
function closeDemo(){
  if(modal.hidden) return;
  modal.hidden = true; document.body.style.overflow="";
  if(lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
document.getElementById("modalClose").onclick = closeDemo;
modal.addEventListener("click", e=>{ if(e.target===modal) closeDemo() });
const inline = document.getElementById("demoInline"); if(inline){ inline.innerHTML = formHTML("p"); bindForm(inline) }

/* ===== Announcement bar ===== */
const ann = document.getElementById("announce");
function renderAnnouncement(){
  const dismissed = store.get("mitsuha_ann_dismissed") === ANNOUNCEMENT.id;
  const over = ANNOUNCEMENT.until && Date.now() > new Date(ANNOUNCEMENT.until + "T23:59:59").getTime();
  ann.hidden = !ANNOUNCEMENT.enabled || dismissed || over;
  document.getElementById("annTag").textContent = ANNOUNCEMENT.tag;
  document.getElementById("annText").innerHTML = ANNOUNCEMENT.text;
  document.getElementById("annLink").innerHTML = !ANNOUNCEMENT.linkText ? "" : ANNOUNCEMENT.action==="demo"
    ? `<button class="link" data-demo="announcement">${ANNOUNCEMENT.linkText}</button>`
    : `<a href="${ANNOUNCEMENT.action}">${ANNOUNCEMENT.linkText}</a>`;
}
document.getElementById("annClose").onclick = ()=>{ store.set("mitsuha_ann_dismissed", ANNOUNCEMENT.id); track("announcement_dismissed",{id:ANNOUNCEMENT.id}); renderAnnouncement() };
renderAnnouncement();

/* ===== Review bar (review builds only; absent on the live site) ===== */
const phToggle = document.getElementById("phToggle");
if(phToggle) phToggle.onclick = ()=>{ const on = document.body.classList.toggle("clean"); phToggle.setAttribute("aria-pressed",on); phToggle.textContent = on ? "Show placeholders" : "Hide placeholders" };

/* ===== Menus ===== */
const dds = [...document.querySelectorAll(".dd")];
const mnav = document.getElementById("mnav"), menuBtn = document.getElementById("menuBtn");
function closeMenus(except){ dds.forEach(d=>{ if(d!==except){ d.classList.remove("open") } }); mnav.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false") }
dds.forEach(d=>{
  let t; d.addEventListener("mouseenter",()=>{ if(matchMedia("(hover:hover)").matches){ clearTimeout(t); closeMenus(d); d.classList.add("open") } });
  d.addEventListener("mouseleave",()=>{ if(matchMedia("(hover:hover)").matches){ t=setTimeout(()=>d.classList.remove("open"),160) } });
  d.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{ d.classList.remove("open"); document.activeElement?.blur() }));
});
menuBtn.onclick = e=>{ e.stopPropagation(); const open = !mnav.classList.contains("open"); closeMenus(); mnav.classList.toggle("open",open); menuBtn.setAttribute("aria-expanded",open) };

document.addEventListener("click", e=>{
  const b = e.target.closest("[data-demo]"); if(b){ e.preventDefault(); openDemo(b.dataset.demo); return }
  const s = e.target.closest("[data-scroll]"); if(s){ e.preventDefault(); document.getElementById(s.dataset.scroll).scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}); return }
  if(e.target.closest("[data-noop]")) e.preventDefault();
  if(!e.target.closest(".dd") && !e.target.closest("#mnav")) closeMenus();
});
document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){ if(!modal.hidden) closeDemo(); else closeMenus() }
  if(e.key==="Tab" && !modal.hidden){
    const f=[...modal.querySelectorAll("button,input:not([type=hidden]):not([tabindex='-1']),select,a[href]")].filter(x=>!x.disabled&&x.offsetParent!==null);
    if(!f.length) return; const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()} else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()}
  }
});
const hdr = document.getElementById("siteHeader");
addEventListener("scroll", ()=>hdr.classList.toggle("scrolled", scrollY > 8), {passive:true});

/* ===== Old preview links (#features, #why-switch ...) -> real URLs ===== */
(function(){ const h = location.hash.slice(1); if(location.pathname === "/" && h && ROUTES[h]) location.replace(ROUTES[h]) })();

SCREENS.ask = () => shell("help","Ask Megumi","Your in-app expert",-1, `
  <div class="ask-search" style="box-shadow:none"><span class="spark sm"></span><span class="typed">How do I edit a patient's profile?</span><kbd>⌘K</kbd></div>
  <div class="ans-card"><div class="who"><span class="spark sm"></span>Ask Megumi</div><p class="sub">Steps you'll go through:</p><ol><li><b>Find the patient.</b> Search their name and open their record.</li><li><b>Open Edit Profile</b> at the top right of the patient's header.</li><li><b>Find the section</b> you need: personal details, contact, insurance, preferences, health history or documents.</li><li><b>Save the changes</b> with Submit.</li></ol><div class="ans-acts"><button type="button" class="go">Start Live Guide</button><button type="button">No thanks</button></div></div>`);

/* ===================== v3 interactive layer ===================== */
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const money = n => "$" + Math.round(n).toLocaleString();
const pick = a => a[Math.floor(Math.random()*a.length)];
function onVisible(el, cb){ if(!("IntersectionObserver" in window)){ cb(true); return } new IntersectionObserver(es=>es.forEach(e=>cb(e.isIntersecting)),{threshold:.2}).observe(el) }
function bump(el){ el.classList.add("bump"); setTimeout(()=>el.classList.remove("bump"),700) }

/* --- Palette picker (review builds only). The live palette is set in site.config.mjs. --- */
(function(){
  const brandSel = document.getElementById("brandSel"); if(!brandSel) return;
  const ok = ["teal-lavender","deep-teal","violet","emerald","coral","obsidian","obsidian-light","aqua"];
  function setBrand(b){ const r=document.documentElement; r.classList.toggle("light-hero", b==="obsidian-light"); r.dataset.brand = b==="obsidian-light" ? "obsidian" : b; brandSel.value = b; store.set("mitsuha_review_brand", b) }
  brandSel.onchange = ()=>setBrand(brandSel.value);
  const saved = store.get("mitsuha_review_brand"); setBrand(ok.includes(saved) ? saved : document.documentElement.dataset.brand);
})();

/* --- About: mission → vision flow as you scroll --- */
(function(){
  const mv=document.querySelector("[data-mv]"); if(!mv) return;
  const steps=mv.querySelectorAll(".mv-step"), div=mv.querySelector(".mv-div");
  if(REDUCE || !("IntersectionObserver" in window)) return;
  mv.classList.add("anim");
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("on") }),{threshold:.35});
  steps.forEach(st=>io.observe(st));
  let raf=0; const upd=()=>{ raf=0; const r=div.getBoundingClientRect(), vh=innerHeight; const p=Math.min(1,Math.max(0,(vh*.75-r.top)/(r.height+vh*.25))); div.style.setProperty("--p",p.toFixed(3)) };
  div.style.setProperty("--p",0); addEventListener("scroll",()=>{ if(!raf) raf=requestAnimationFrame(upd) },{passive:true}); addEventListener("hashchange",()=>setTimeout(upd,50)); upd();
})();


/* --- Hero live dashboard --- */
(function(){
  const list = document.getElementById("lvList"), claimsEl = document.getElementById("lvClaims"), paidEl = document.getElementById("lvPaid"), aiEl = document.getElementById("lvAi");
  if(!list) return;
  const pool = [["9:00","J. Lee","Crown prep"],["9:30","M. Ortiz","Cleaning"],["10:15","D. Park","Root canal"],["10:45","A. Novak","Exam"],["11:00","R. Patel","Filling"],["11:30","S. Brooks","Cleaning"],["1:00","T. Berg","Consult"],["1:30","L. Vang","Cleaning"]];
  let start = 0, st = [1,1,0,0], claims = 18, paid = 6420, sentHr = 3;
  const pillFor = (s,i)=> s===0 ? '<span class="pill p-check">Checking</span>' : (pool[(start+i)%pool.length][1]==="D. Park" ? '<span class="pill p-warn">Check plan</span>' : '<span class="pill p-ok">Eligible</span>');
  function render(){ list.innerHTML = st.map((s,i)=>{ const [t,n,p]=pool[(start+i)%pool.length]; return `<div class="lr"><span>${t} · ${n} · ${p}</span>${pillFor(s,i)}</div>` }).join("") }
  render();
  const toast = document.getElementById("liveToast");
  const events = [
    ["var(--ok-bg)","var(--ok)","check","Insurance verified","M. Ortiz · Sample PPO"],
    ["#E9F4F5","var(--teal-dark)","billing","Claim paid · $1,180","J. Lee · Crown, #3"],
    ["var(--ok-bg)","var(--ok)","message","Appointment confirmed","A. Novak replied C by text"],
    ["var(--ai-soft)","var(--ai-deep)","spark","Amy called J. Lee","Preauthorization approved: crown #3"],
    ["var(--warn-bg)","var(--warn)","alert","1 claim needs a look","X-ray attachment missing"]
  ];
  const ICO = {check:'<path d="M5 12.5l4.5 4.5L19 7"/>',billing:P.billing,message:P.message,alert:'<circle cx="12" cy="12" r="8"/><path d="M12 8v5M12 16h.01"/>'};
  let ev = 0;
  function showToast(){
    const [bg,fg,ic,t,s] = events[ev++ % events.length];
    const glyph = ic==="spark" ? '<span class="spark"></span>' : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICO[ic]}</svg>`;
    toast.innerHTML = `<span class="ti" style="background:${bg};color:${fg}">${glyph}</span><span><b>${t}</b>${s}</span>`;
    toast.classList.remove("in"); void toast.offsetWidth; toast.classList.add("in");
  }
  showToast();
  if(REDUCE) return;
  let visible = true; onVisible(document.querySelector(".hero-frame"), v=>visible=v);
  setInterval(()=>{
    if(!visible || document.hidden || route()!=="home") return;
    const i = st.indexOf(0);
    if(i>=0){ st[i]=1; render() }
    else { start=(start+1)%pool.length; st=[1,1,1,0]; render() }
    if(Math.random()<.6){ claims++; claimsEl.textContent=claims; bump(claimsEl) }
    if(Math.random()<.45){ paid += pick([64,142,215,380,960]); paidEl.textContent=money(paid); bump(paidEl); sentHr = Math.min(9,sentHr+1); aiEl.textContent=`AI billing sent ${sentHr} claims in the last hour` }
  }, 2400);
  setInterval(()=>{ if(visible && !document.hidden && route()==="home") showToast() }, 3600);
})();

/* --- Live AI billing pipeline (home + AI billing page) --- */
const STAGE = ["Checking coverage","Claim built","Sent to payer","Paid"];
const STAGE_CLS = ["p-check","p-info","p-info","p-ok"];
const PATIENTS = [["J. Lee","D2740 · Crown",1180],["M. Ortiz","D1110 · Cleaning",142],["A. Novak","D0120 · Exam",64],["R. Patel","D2392 · Filling",215],["S. Brooks","D1110 · Cleaning",142],["T. Berg","D0150 · New patient exam",120],["L. Vang","D4341 · Scaling",380],["K. Olson","D2750 · Crown",1240],["B. Nguyen","D0274 · X-rays",96],["E. Hart","D2330 · Filling",185]];
document.querySelectorAll("[data-pipe]").forEach(pipe=>{
  const rowsEl = pipe.querySelector(".pipe-rows"), btn = pipe.querySelector(".pipe-toggle");
  const S = {sent:41, paid:33, amt:12480, touch:2};
  let nextP = 5, flagWait = 0, playing = !REDUCE, visible = false, newId = null;
  let rows = [
    {p:PATIENTS[0],s:3},{p:PATIENTS[1],s:2},{p:["D. Park","D3330 · Root canal",960],s:2,flag:true},{p:PATIENTS[3],s:1},{p:PATIENTS[4],s:0}
  ];
  const statsEl = k => pipe.querySelector(`[data-k="${k}"]`);
  function render(){
    rowsEl.innerHTML = `<div class="pr hdr"><span>Claim</span><span class="segs"><i>Checked</i><i>Built</i><i>Sent</i><i>Paid</i></span><span>Status</span></div>` +
      rows.map(r=>`<div class="pr ${r.id===newId?'new':''}"><span class="nm"><b>${r.p[0]} · ${money(r.p[2])}</b><span>${r.p[1]}</span></span><span class="segs">${[0,1,2,3].map(i=>`<i class="${r.flag&&i===r.s?'flag':i<=r.s?'on':''}"></i>`).join("")}</span><span class="pill ${r.flag?'p-warn':STAGE_CLS[r.s]}">${r.flag?'X-ray needed':STAGE[r.s]}</span></div>`).join("");
    statsEl("sent").textContent=S.sent; statsEl("paid").textContent=S.paid; statsEl("amt").textContent=money(S.amt); statsEl("touch").textContent=S.touch;
  }
  function tick(){
    newId = null;
    const done = rows.findIndex(r=>r.s===3);
    if(done>=0 && Math.random()<.5){ rows.splice(done,1); const id=Date.now(); rows.push({p:PATIENTS[nextP++%PATIENTS.length],s:0,id}); newId=id; render(); return }
    const flagged = rows.find(r=>r.flag);
    if(flagged && ++flagWait>9){ flagged.flag=false; flagWait=0; S.touch++; bump(statsEl("touch")); render(); return }
    const movable = rows.filter(r=>!r.flag && r.s<3);
    if(movable.length){ const r = pick(movable); r.s++;
      if(r.s===2){ S.sent++; bump(statsEl("sent")) }
      if(r.s===3){ S.paid++; S.amt+=r.p[2]; bump(statsEl("paid")); bump(statsEl("amt")) } }
    render();
  }
  render();
  if(REDUCE){ btn.hidden = true; return }
  btn.onclick = ()=>{ playing=!playing; btn.textContent = playing?"Pause":"Play"; btn.setAttribute("aria-pressed", !playing); pipe.querySelector(".live-dot").textContent = playing?"Running":"Paused" };
  onVisible(pipe, v=>visible=v);
  setInterval(()=>{ if(playing && visible && !document.hidden) tick() }, 1300);
});

/* --- Product tour autoplay --- */
(function(){
  const tabs = document.querySelector(".tour-tabs"), panel = document.getElementById("tourPanel");
  if(REDUCE || !tabs) return;
  let auto = true;
  const restart = ()=>{ tabs.classList.remove("playing"); void tabs.offsetWidth; if(auto) tabs.classList.add("playing") };
  const origSet = setTour;
  setTour = function(k, f){ origSet(k, f); restart() };
  tabs.addEventListener("animationend", e=>{
    if(!auto || !e.target.classList.contains("prog")) return;
    const keys=Object.keys(TOUR), cur=keys.indexOf(document.querySelector('[data-tour][aria-selected="true"]').dataset.tour);
    setTour(keys[(cur+1)%keys.length]);
  });
  tabs.addEventListener("click", ()=>{ auto=false; tabs.classList.remove("playing") }, true);
  tabs.addEventListener("keydown", ()=>{ auto=false; tabs.classList.remove("playing") }, true);
  [tabs, panel].forEach(el=>{ el.addEventListener("mouseenter",()=>tabs.classList.add("paused")); el.addEventListener("mouseleave",()=>tabs.classList.remove("paused")) });
  onVisible(panel, v=>tabs.classList.toggle("paused", !v));
  restart();
})();

/* --- Ask Megumi in-app expert demo (matches the in-app chat panel); runs on every [data-meg] panel --- */
const MEG_QS = {"12": "How do I edit a patient's profile?", "0": "How do I work through a hygiene patient visit?", "18": "How do I refund a Stripe payment?"};
const MEG_ORDER = [12, 0, 18];
const MEG_GUIDES = {
    12: {desc:"Walks you through changing a patient's details: opening Edit Profile from their header, finding the right section, and saving.",
      steps:[["Find the Patient","Search the patient's name in the search bar at the top, then select them to open their record."],
             ["Open Edit Profile","Click <b>Edit Profile</b> at the top right of the patient's header. It opens the same form used to register them, filled in with everything already on file."],
             ["Find the Section","The form is split into sections, listed down the left: personal details, contact, insurance, preferences, health history and documents. Scroll to the one you need and change it. Everything is editable, so fix as much or as little as you came for."],
             ["Save the Changes","Click <b>Submit</b> to save your changes onto the patient's record. You land back on their overview with the new details showing. <b>Cancel</b> throws the changes away instead."]]},
    0: {desc:"Walks you through a hygiene appointment from arrival to room cleanup.",
      steps:[["Start Appointment", "Click <b>In Treatment</b> in the status menu, or <b>Start Appt</b> on the patient page, to mark the patient as In Treatment and bring them back. Kaguya will open in a new tab for voice recording."], ["Take Pano X-Ray", "Patient is due for a Pano. Bring them back and ask the LDA to take it. Once you've confirmed with the LDA, hit <b>Next</b>. <span class=\"note\">(Only when due. Skipped if the patient already has a Pano from the last 5 years, or is a hygiene patient under 6.)</span>"], ["Mark Pano", "Check the <b>Panoramic</b> box under X-Rays Rendered once the Pano is done. <span class=\"note\">(Only when due. Skipped if the patient already has a Pano from the last 5 years, or is a hygiene patient under 6.)</span>"], ["Fill Required Fields", "Please select exam type."], ["Blood Pressure & Tray Setup", "Patient is over 18. Take their blood pressure, then set up the tray while you wait for the reading. <span class=\"note\">(BP is skipped for patients under 18; tray setup still applies.)</span>"], ["Start Recording", "Press the green <b>Record</b> button to start recording the prescreen. <span class=\"note\">(Use Pause any time someone interrupts. Nothing is recorded while paused.)</span>"], ["Prescreen", "Run through the prescreening questions with the patient. Ask them if there's been any changes to their medical history, when their last visit was, how many times they brush and floss a day, do they clench or grind their teeth, and whether or not they smoke, chew, or vape."], ["Stop Recording", "When the prescreen is finished, press the <b>Done with Questions</b> button to finish this section."], ["Bitewing X-Ray", "Patient is due for bitewings. Open the patient's Images tab and click <b>Capture X-Rays</b>. Netra opens for this patient: choose the Bitewing template there, then ask the LDA to take the x-rays. <span class=\"note\">(Only when due. Skipped if the patient already has bitewings from the past year, has no molars, or is a hygiene patient under 6.)</span>"], ["Finish Capture", "After LDA has finished taking and retaking x-rays if needed, finish the capture in Netra. Netra uploads the series to the chart on its own."], ["Check X-Rays", "Open <b>View X-Rays</b> and check the bitewing series arrived from Netra. This step finishes on its own once it has."], ["X-Ray Cleanup", "Put the bite tabs and used sleeve on the tray. <span class=\"note\">(Only if a bitewing was taken. Removed entirely when bitewings are not due.)</span>"], ["X-Ray Cleanup", "Wipe down the x-ray unit and sensor, then put them both away. <span class=\"note\">(Only if a bitewing was taken. Removed entirely when bitewings are not due.)</span>"], ["Back to Kaguya", "Go back for the next steps."], ["Hygiene Measurements", "Have the hygienist examine the patient and note down their measurements and assessments."], ["Charting Existing", "Go to the patient's chart and click <b>Start Charting</b> to begin charting existing."], ["Stop Charting", "When the hygienist has finished, stop the chart recording."], ["Review Existing", "Press <b>Review Later</b> for the hygienist to review conditions later."], ["Charting Perio", "Go to the Perio tab to begin perio charting. Start a new exam, then start the recording. <span class=\"note\">(Skipped for patients under 18.)</span>"], ["Finish Perio", "When the hygienist has finished, finish and save the exam. <span class=\"note\">(Skipped for patients under 18.)</span>"], ["Stop Recording", "When the hygienist is finished, press the <b>Done with Hygiene</b> button to finish this section."], ["Exam", "Take note of the treatments and any medications the dentist recommends, if any."], ["Stop Recording", "When the dentist is finished, press the red <b>End &amp; generate</b> button to end this section and generate the final notes."], ["Treatment Rendered", "In today's appointment, review the rendered services and make sure everything is correct."], ["Adjust Services", "Please edit the rendered services as needed. Add missing services, edit teeth/surfaces, or remove services not performed."], ["Finish Appointment", "Close the expanded service if needed, then click <b>Finish</b> to complete the appointment."], ["Schedule Back", "Schedule the patient's next visit before they leave. Use the find next appointment tool to filter possible slots."], ["Schedule Back", "Ask if they prefer specific days and times or the soonest possible. <span class=\"note\">Each hour is four separate 15-minute cells, and the one you click becomes the start time. Hover first: the cell turns blue and shows its exact time. Click the top of the coloured tab so the appointment fills it. A single click opens the appointment. Pressing and dragging across cells makes a time Block instead.</span>"], ["Schedule Back", "Search by the patient's name, or by their date of birth as MM-DD-YYYY. Each result shows a date of birth and chart ID under the name, so use those to pick the right person when the name is a common one."], ["Schedule Back", "Choose the appointment type."], ["Schedule Back", "Save the new appointment."], ["Walk Patient Out", "Walk the patient out to the exit. Tell them to have a good day and thank them for coming."], ["Clear the Room", "Toss any trash (headrest cover, bib, sterilization pouches, etc)."], ["Clear the Room", "Gather used instruments onto tray and bring to sterile."], ["Clear the Room", "Wipe down all surfaces with caviwipes (chair/keyboard/mouse)."], ["Next Tray", "Bring out a tray for the next patient and reset the room."]]},
    18: {desc:"Shows you how to send a Stripe payment back to the patient's card, choose the reason, and follow the refund until it succeeds.",
      steps:[["Find the Patient","Search the patient's name in the search bar at the top, then select them to open their record. Open the patient who is getting the money back."],
             ["Open Account","Click <b>Account</b> in the patient's tab row. The Stripe Payments card sits near the top of the page."],
             ["Pick the Payment","On the Stripe card, find the payment and click its red <b>Refund</b> button. Hover it to see which card the money goes back to. Every payment that can still be refunded is highlighted."],
             ["Amount and Reason","The amount starts at the most you can refund. Lower it for a partial refund. Pick the <b>Reason</b> and fill in the detail underneath (the claim number when insurance paid for it)."],
             ["Send the Refund","Click the red <b>Refund</b> button at the bottom. Stripe usually takes 5 to 10 business days to show it on the patient's statement."],
             ["Follow the Refund","The payment row now shows the refund. If it says pending, click <b>Check refund status</b> to ask Stripe again. When it succeeds, a <b>Refund receipt</b> link appears for the patient's records."]]}
  };
function megumiDemo(panel, routeName, startAt){
  const typed = panel.querySelector(".typed"), body = panel.querySelector(".meg-body");
  const bot = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9.5 13h.01M14.5 13h.01"/></svg>';
  const acts = '<div class="ans-acts"><button type="button" class="go" data-guide>Start Live Guide</button><button type="button" data-guide-no>No thanks</button></div>';
  let run = 0, guideTimer = null, cycle = null, user = false, visible = false, cur = startAt;
  const wait = ms => new Promise(r=>setTimeout(r, REDUCE?0:ms));
  const down = ()=> body.scrollTo({top: body.scrollHeight, behavior: REDUCE ? "auto" : "smooth"});
  const faq = i => `<p class="sub">Frequently Asked:</p><div class="meg-faq">${MEG_ORDER.map(k=>`<button type="button" data-ask="${k}" aria-pressed="${k===i}">${MEG_QS[k]}</button>`).join("")}</div>`;
  async function play(i){
    const id = ++run; clearInterval(guideTimer); clearTimeout(cycle); cur = i;
    const q = MEG_QS[i], g = MEG_GUIDES[i]; typed.textContent = "";
    body.innerHTML = `<div class="mb-bot"><span class="mb-av">${bot}</span><div class="mb-txt"><p>Hi! I'm your Help Assistant. Ask me a question or pick one from the suggestions below.</p></div></div>`;
    for(let k=1;k<=q.length;k++){ if(id!==run) return; typed.textContent = q.slice(0,k); await wait(30) }
    await wait(350); if(id!==run) return;
    typed.textContent = "";
    body.insertAdjacentHTML("beforeend", `<div class="mb-me">${q}</div>`);
    body.insertAdjacentHTML("beforeend", `<div class="mb-bot"><span class="mb-av">${bot}</span><div class="mb-txt"><span class="thinking" aria-label="Megumi is typing"><i></i><i></i><i></i></span></div></div>`);
    down(); await wait(800); if(id!==run) return;
    const txt = body.querySelector(".mb-bot:last-child .mb-txt");
    if(g){
      txt.innerHTML = `<p>${g.desc}</p><p class="sub">Steps you'll go through:</p><ol class="guide"></ol>`;
      const ol = txt.querySelector("ol"), gap = g.steps.length > 10 ? 160 : 650;
      for(const [t,d] of g.steps){ if(id!==run) return; ol.insertAdjacentHTML("beforeend", `<li><b>${t}.</b> ${d}</li>`); down(); await wait(gap) }
      txt.insertAdjacentHTML("beforeend", acts + faq(i)); down();
    } else {
      txt.innerHTML = `<p>Megumi walks your team through this step by step. <span class="ph">[guide steps to add]</span></p>${acts}${faq(i)}`; down();
    }
    if(!user && !REDUCE) cycle = setTimeout(next, g ? (g.steps.length > 10 ? 9000 : 7000) : 4500);
  }
  function next(){ if(user) return; if(!visible || route()!==routeName){ cycle = setTimeout(next, 1500); return } play(MEG_ORDER[(MEG_ORDER.indexOf(cur)+1)%MEG_ORDER.length]) }
  body.addEventListener("click", e=>{
    const qb = e.target.closest("[data-ask]"); if(qb){ user = true; play(+qb.dataset.ask); return }
    if(e.target.closest("[data-guide-no]")){ clearInterval(guideTimer); e.target.closest(".ans-acts").remove(); return }
    const go = e.target.closest("[data-guide]"); if(!go) return;
    user = true; clearTimeout(cycle);
    const items = [...body.querySelectorAll("ol.guide li")];
    if(!items.length){ go.textContent = "Live guide opens in Mitsuha"; return }
    let k = 0; clearInterval(guideTimer);
    const step = ()=>{ items.forEach((li,j)=>li.classList.toggle("on", j===k)); if(items[k]) items[k].scrollIntoView({block:"nearest", behavior: REDUCE?"auto":"smooth"}); go.textContent = k < items.length ? `Step ${k+1} of ${items.length}` : "Guide finished"; if(k >= items.length){ clearInterval(guideTimer); items.forEach(li=>li.classList.remove("on")) } k++ };
    step(); if(!REDUCE) guideTimer = setInterval(step, items.length > 10 ? 1300 : 2000);
    track("megumi_live_guide",{page:routeName});
  });
  let started = false;
  onVisible(panel, v=>{ visible = v; if(v && !started && route()===routeName){ started = true; play(startAt) } });
  window.addEventListener("hashchange", ()=>{ if(!started && route()===routeName && visible){ started = true; play(startAt) } });
  if(REDUCE){ started = true; play(startAt) }
}
document.querySelectorAll("[data-meg]").forEach(p=>megumiDemo(p, p.dataset.meg, +p.dataset.megStart));

/* --- Website chatbot (preview: scripted answers) --- */
(function(){
  const demoBtn = '<div><button class="btn btn-primary btn-sm" data-demo="chatbot">Book a demo</button></div>';
  const KB = [
    {re:/dentrix/i, a:`<p>Lots of practices come to us from Dentrix. Here's a side-by-side comparison and what moves over: <a href="/why-mitsuha/dentrix">Mitsuha vs Dentrix</a>.</p>`},
    {re:/eaglesoft/i, a:`<p>Practices on Eaglesoft look at Mitsuha when they want to move to the cloud. See the comparison: <a href="/why-mitsuha/eaglesoft">Mitsuha vs Eaglesoft</a>.</p>`},
    {re:/open ?dental/i, a:`<p>Here's how we compare, including staff time: <a href="/why-mitsuha/open-dental">Mitsuha vs Open Dental</a>.</p>`},
    {re:/\bamy\b|calls? (my |our |the )?patients|phone call|recall|confirm appointments/i, a:`<p>That's me! Besides answering questions here, I call patients for practices on Mitsuha: confirming appointments, rescheduling, recall calls, filling open slots, and letting patients know when a preauthorization is approved or denied. You can hear a sample call on our <a href="/features#feat-amy">Features page</a>.</p>`},
    {re:/imaging|x-?ray viewer|view (my )?x-?rays|bitewing|pano/i, a:`<p>Mitsuha has its own imaging software, built in, so X-rays and other images open right in the patient's record, linked to the tooth on the chart, with brightness and contrast tools. It connects to intraoral sensors and panoramic machines that use standard TWAIN drivers. <a href="/features">See imaging</a>. Supported sensors: ${ph("[confirm list]")}.</p>`},
    {re:/demo|book|sales|talk to|call|meeting|someone/i, a:`<p>Happy to set that up. A demo takes 20 minutes and you pick the time.</p>${demoBtn}`},
    {re:/price|pricing|cost|how much|fee|expensive|cheap/i, a:FAQ["Cost"][0][1]+demoBtn},
    {re:/sensor|imaging|bridge|scanner/i, a:FAQ["Switching"][2][1]},
    {re:/x-?ray|chart|history|lose|keep my|data/i, a:FAQ["Switching"][1][1]},
    {re:/how long|timeline|switch|migrat|move|convert|go live/i, a:FAQ["Switching"][0][1]+`<p>More on <a href="/why-mitsuha">why practices choose Mitsuha</a>.</p>`},
    {re:/hipaa|secur|baa|privacy|encrypt|backup|safe/i, a:FAQ["Security"][0][1]},
    {re:/server|install|browser|cloud|internet|offline/i, a:FAQ["Security"][1][1]},
    {re:/megumi|ask mitsuha|help inside|in-app|how do i|training guide/i, a:`<p>Ask Megumi is Mitsuha's in-app expert. It answers your team's how-to questions in plain words and walks them through each task step by step, from charting and scheduling to imaging and billing. <a href="/features">See Ask Megumi</a></p>`},
    {re:/\bai\b|claim|billing|insurance|eligib|denial|denied/i, a:FAQ["AI billing"][0][1]},
    {re:/train|support|learn|onboard/i, a:FAQ["Training and support"][0][1]},
    {re:/who|built|founder|story|company/i, a:`<p>Mitsuha was built by dentists who run their own offices on it every day. <a href="/about">About us</a>.</p>`},
    {re:/patient app|mobile app|\bapp\b|portal|pay (my |a )?bill|dependent|family/i, a:`<p>Patients get the Mitsuha app to book, reschedule or cancel visits, update their details, manage family members and their visits, check their insurance coverage, pay their bills online, and get appointment reminders. Preauthorization updates in the app are coming soon. <a href="/features">See the patient app</a>.</p>`},
    {re:/scribe|soap|dictat|voice chart|clinical note|doctor.?s notes/i, a:`<p>AI Scribe listens during the visit and writes up the doctor's notes, adds the procedure codes and builds the treatment plan, then sends it all on to billing. <a href="/features">See AI Scribe</a>.</p>`},
    {re:/feature|schedul|text|remind|report|chart/i, a:`<p>Mitsuha covers scheduling, charting, AI billing, insurance checks, a patient app and reports in one cloud system. <a href="/features">See all features</a>.</p>`}
  ];
  const SUGG = ["What can Amy do?","How much does it cost?","How long does switching take?","Is it HIPAA compliant?","Book a demo"];
  const launch = document.getElementById("cbLaunch"), panel = document.getElementById("cb"), body = document.getElementById("cbBody"), form = document.getElementById("cbForm"), input = document.getElementById("cbInput"), nudge = document.getElementById("cbNudge");
  let greeted = false;
  const add = (who, html) => { body.insertAdjacentHTML("beforeend", `<div class="cb-msg ${who}">${html}</div>`); body.scrollTop = body.scrollHeight; if(who==="bot" && window.amySpeak) window.amySpeak(html) };
  function sugg(){ body.insertAdjacentHTML("beforeend", `<div class="cb-sugg">${SUGG.map(s=>`<button type="button">${s}</button>`).join("")}</div>`); body.scrollTop = body.scrollHeight }
  function openCb(){
    panel.hidden = false; launch.setAttribute("aria-expanded","true"); nudge.hidden = true;
    try{ sessionStorage.setItem("mitsuha_nudged","1") }catch(e){}
    if(!greeted){ greeted = true; add("bot", "<p>Hi, I'm Amy, Mitsuha's assistant. Ask me about features, switching, security or pricing. I can type or talk.</p>"); sugg(); track("chat_open") }
    setTimeout(()=>input.focus(), 50);
  }
  function closeCb(){ panel.hidden = true; launch.setAttribute("aria-expanded","false"); launch.focus() }
  function answer(q){
    add("me", esc(q)); track("chat_question",{q:q.slice(0,80)});
    body.insertAdjacentHTML("beforeend", '<div class="cb-msg bot cb-typing"><span class="thinking"><i></i><i></i><i></i></span></div>'); body.scrollTop = body.scrollHeight;
    setTimeout(()=>{
      body.querySelector(".cb-typing")?.remove();
      const hit = KB.find(k=>k.re.test(q));
      add("bot", hit ? hit.a : `<p>Good question. I don't have that answer here yet, so the quickest way is a short demo where our team can answer it.</p>${demoBtn}`);
    }, REDUCE?0:800);
  }
  launch.onclick = ()=> panel.hidden ? openCb() : closeCb();
  document.getElementById("cbX").onclick = closeCb;
  form.onsubmit = e=>{ e.preventDefault(); const q = input.value.trim(); if(!q) return; input.value = ""; answer(q) };
  body.addEventListener("click", e=>{ const b = e.target.closest(".cb-sugg button"); if(b){ b.parentElement.remove(); answer(b.textContent) } });
  nudge.addEventListener("click", e=>{ if(e.target.closest("button")){ nudge.hidden = true; try{ sessionStorage.setItem("mitsuha_nudged","1") }catch(_){} } else openCb() });
  let nudged = false; try{ nudged = sessionStorage.getItem("mitsuha_nudged")==="1" }catch(e){}
  if(!nudged) setTimeout(()=>{ if(panel.hidden) nudge.hidden = false }, 6000);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !panel.hidden && modal.hidden) closeCb() });
})();

/* ===================== v4: office scenes, imaging, Amy ===================== */
/* --- Office background (placeholder illustration until real photos) --- */
function officeSVG(){
  const mull = [...Array(7)].map((_,i)=>`<rect x="${134+i*220}" y="90" width="12" height="552" fill="#fff"/>`).join("");
  const bld = [[180,420,90,220],[300,380,70,260],[520,450,120,190],[700,400,80,240],[880,430,110,210],[1080,370,90,270],[1250,440,120,200]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C9D9DE" opacity=".55"/>`).join("");
  const trees = [[220,600,120],[420,610,150],[640,590,130],[900,605,160],[1150,595,140],[1380,610,120]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.55}" fill="var(--mint)" opacity=".55"/>`).join("");
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <linearGradient id="oSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDEEF5"/><stop offset="1" stop-color="#F8FCFD"/></linearGradient>
    <linearGradient id="oFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF1F0"/><stop offset="1" stop-color="#DCE2E1"/></linearGradient>
    <linearGradient id="oBeam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <filter id="oBlur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4"/></filter></defs>
    <rect width="1600" height="900" fill="var(--hero-a)"/>
    <rect x="134" y="90" width="1332" height="552" fill="url(#oSky)"/>
    <g filter="url(#oBlur)">${bld}${trees}</g>
    ${mull}<rect x="134" y="84" width="1332" height="12" fill="#fff"/><rect x="134" y="352" width="1332" height="8" fill="#fff" opacity=".9"/><rect x="134" y="636" width="1332" height="14" fill="#fff"/>
    <rect x="0" y="650" width="1600" height="250" fill="url(#oFloor)"/>
    <rect x="134" y="660" width="1332" height="110" fill="#fff" opacity=".35"/>
    <polygon points="160,96 640,96 1180,900 420,900" fill="url(#oBeam)" opacity=".5"/>
    <polygon points="760,96 1060,96 1500,900 1080,900" fill="url(#oBeam)" opacity=".35"/>
    ${[1000,1150,1300].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="160" stroke="#9FB3B6" stroke-width="2"/><ellipse cx="${x}" cy="170" rx="34" ry="14" fill="#fff" stroke="#DDE6E7"/>`).join("")}
    <g filter="url(#oBlur)" opacity=".95">
      <path d="M900 640 h520 a30 30 0 0 1 30 30 v120 h-580 v-120 a30 30 0 0 1 30 -30z" fill="#fff" stroke="#E2E8E8" stroke-width="2"/>
      <rect x="870" y="640" width="580" height="16" rx="8" fill="var(--teal)" opacity=".85"/>
      <rect x="240" y="690" width="150" height="70" rx="30" fill="var(--aqua)"/><rect x="250" y="660" width="130" height="44" rx="20" fill="var(--aqua)" opacity=".8"/>
      <rect x="430" y="690" width="150" height="70" rx="30" fill="var(--aqua)"/><rect x="440" y="660" width="130" height="44" rx="20" fill="var(--aqua)" opacity=".8"/>
      <ellipse cx="410" cy="790" rx="90" ry="16" fill="#fff" stroke="#E2E8E8"/>
      <rect x="1500" y="680" width="56" height="90" rx="10" fill="#E9EEEE"/>
      ${[[-40,-60],[0,-90],[40,-55],[-20,-120],[25,-130]].map(([dx,dy],i)=>`<ellipse cx="${1528+dx}" cy="${680+dy}" rx="26" ry="60" transform="rotate(${dx/2} ${1528+dx} ${680+dy})" fill="${i%2?'#6FAF85':'#5E9E77'}" opacity=".9"/>`).join("")}
      <rect x="60" y="690" width="50" height="80" rx="10" fill="#E9EEEE"/>
      ${[[-25,-50],[10,-80],[30,-45]].map(([dx,dy])=>`<ellipse cx="${85+dx}" cy="${690+dy}" rx="22" ry="52" fill="#6FAF85" opacity=".85"/>`).join("")}
    </g></svg>`;
}
document.querySelectorAll("[data-office]").forEach(el=>el.innerHTML = officeSVG());

/* --- Radiograph renderer (sample images) --- */
function toothXR(x, cy, w, h, up, fill, rootLen){
  const rc = up ? cy - rootLen/2 + 8 : cy + h + rootLen/2 - 8;
  const roots = w > 60 ? [x+w*.3, x+w*.7] : [x+w/2];
  const pulpY = up ? cy + h*.4 : cy + h*.6;
  return `${roots.map(rx=>`<ellipse cx="${rx}" cy="${rc}" rx="${w*.15}" ry="${rootLen/2}" fill="#9AA4A6" opacity=".75"/><line x1="${rx}" y1="${pulpY}" x2="${rx}" y2="${up?rc-rootLen/2+10:rc+rootLen/2-10}" stroke="#262D2E" stroke-width="3" opacity=".7"/>`).join("")}
    <rect x="${x}" y="${cy}" width="${w}" height="${h}" rx="18" fill="url(#xrEn)"/>
    <ellipse cx="${x+w/2}" cy="${pulpY}" rx="${w*.17}" ry="${h*.2}" fill="#222829" opacity=".75"/>
    ${fill ? `<rect x="${x+w*.22}" y="${up?cy+h*.62:cy+h*.06}" width="${w*.56}" height="${h*.32}" rx="8" fill="#fff"/>` : ""}`;
}
function xraySVG(kind, annotate){
  let teeth = "";
  if(kind===0||kind===1){
    const xs=[18,112,206,300], fu = kind===0?[1]:[3], fl = kind===0?[2]:[0];
    xs.forEach((x,i)=>{ teeth += toothXR(x,54,84,72,true,fu.includes(i),110) + toothXR(x,134,84,72,false,fl.includes(i),110) });
  } else if(kind===2){
    teeth = toothXR(70,40,110,90,false,false,190) + toothXR(220,40,110,90,false,true,190);
  } else {
    for(let i=0;i<12;i++){ const x=14+i*31.5, arc=Math.pow((i-5.5)/5.5,2)*26; teeth += toothXR(x,70+arc,26,40,true,i===3,70) + toothXR(x,132-arc*.4,26,40,false,i===8,70) }
  }
  const ann = annotate && kind===0 ? `<circle cx="154" cy="96" r="52" fill="none" stroke="var(--cyan)" stroke-width="2.5" stroke-dasharray="6 5"/><rect x="212" y="18" width="120" height="24" rx="6" fill="rgba(0,0,0,.6)"/><text x="222" y="35" fill="#E8F4F4" font-size="12" font-family="Inter,sans-serif">Note: watch #14</text>` : "";
  return `<svg class="xr-img" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <radialGradient id="xrBg" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#3A4446"/><stop offset="1" stop-color="#07090A"/></radialGradient>
    <linearGradient id="xrEn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F6F6"/><stop offset=".5" stop-color="#C9D1D2"/><stop offset="1" stop-color="#EEF2F2"/></linearGradient>
    <filter id="xrN"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${kind+3}"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .09 0"/></filter></defs>
    <rect width="400" height="260" fill="url(#xrBg)"/><g opacity=".92">${teeth}</g><rect width="400" height="260" filter="url(#xrN)"/>${ann}</svg>`;
}
const XR_NAMES = ["BW left","BW right","PA #19","Pano"];
const xrIco = ['<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>','<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>','<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8v6M8 11h6"/>','<path d="M4 16L16 4l4 4L8 20z"/><path d="M8 12l2 2M11 9l2 2"/>'];
SCREENS.xray = () => shell("patients/lee/imaging","Imaging","Jordan Lee · Bitewings, Feb 10",1, `
  <div class="xr"><div class="xr-main">${xraySVG(0,true)}<div class="xr-tools">${xrIco.map(p=>`<span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${p}</svg></span>`).join("")}</div><span class="xr-tag">BW left · linked to #14</span></div>
  <div class="xr-thumbs">${[0,1,2,3].map(k=>`<button type="button" aria-pressed="${k===0}" data-xr="${k}" aria-label="Show ${XR_NAMES[k]}">${xraySVG(k)}<span>${XR_NAMES[k]}</span></button>`).join("")}</div></div>`);
document.addEventListener("click", e=>{
  const b = e.target.closest("[data-xr]"); if(!b) return;
  const app = b.closest(".app"), k = +b.dataset.xr;
  app.querySelectorAll("[data-xr]").forEach(x=>x.setAttribute("aria-pressed", x===b));
  const main = app.querySelector(".xr-main"); main.querySelector("svg.xr-img").outerHTML = xraySVG(k, k===0);
  main.querySelector(".xr-tag").textContent = XR_NAMES[k] + (k===0 ? " · linked to #14" : "");
});
["xr-b","xr-c"].forEach(id=>{ const el=document.getElementById(id); if(!el) return; el.addEventListener("input",()=>{ const f=document.getElementById("xrFeature"); f.style.setProperty("--xb", document.getElementById("xr-b").value/100); f.style.setProperty("--xc", document.getElementById("xr-c").value/100) }) });
TOUR.xray = ["X-rays","Bitewings, periapicals and panos open in the patient's record, linked to the tooth they belong to.",["Images linked to the chart","Brightness and contrast tools","Attach to claims in one click"]];

/* --- Tooth chart with drawn teeth --- */
function chartSVG(){
  const type = n => [1,2,3,14,15,16,17,18,19,30,31,32].includes(n)?"m":[4,5,12,13,20,21,28,29].includes(n)?"p":[6,11,22,27].includes(n)?"c":"i";
  const W = {m:32,p:26,c:23,i:21}, R = {m:2,p:1,c:1,i:1}, L = {m:34,p:38,c:46,i:40};
  const state = n => [3,14,30].includes(n)?"tx":[8,12,19].includes(n)?"ex":[1,16,17,32].includes(n)?"mi":"";
  let out = "";
  const draw = (n, slot, up) => {
    const t = type(n), w = W[t], x = slot*40 + (40-w)/2, s = state(n);
    const cTop = up ? 46 : 146, cH = 44, rl = L[t];
    const rcy = up ? cTop - rl/2 + 6 : cTop + cH + rl/2 - 6;
    const roots = R[t]===2 ? [x+w*.3, x+w*.7] : [x+w/2];
    let g = roots.map(rx=>`<ellipse cx="${rx}" cy="${rcy}" rx="${R[t]===2?w*.16:w*.22}" ry="${rl/2}" fill="#F3EADA" stroke="#E2D6BE"/>`).join("");
    g += `<rect x="${x}" y="${cTop}" width="${w}" height="${cH}" rx="${w*.38}" fill="#FCF9F2" stroke="#D9CDB5" stroke-width="1.2"/>`;
    if(s==="ex") g += `<rect x="${x+w*.2}" y="${up?cTop+cH*.5:cTop+cH*.12}" width="${w*.6}" height="${cH*.38}" rx="5" fill="var(--teal)" opacity=".9"/>`;
    if(s==="tx") g += `<rect x="${x+2}" y="${cTop+2}" width="${w-4}" height="${cH-4}" rx="${w*.34}" fill="#E8A33D" opacity=".85"/>`;
    if(s==="mi") g = `<g opacity=".18">${g}</g><path d="M${x+4} ${cTop+6}L${x+w-4} ${cTop+cH-6}M${x+w-4} ${cTop+6}L${x+4} ${cTop+cH-6}" stroke="#8A9799" stroke-width="2"/>`;
    out += g + `<text x="${slot*40+20}" y="${up?112:136}" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="${s==="tx"?'#9A5B00':'#5B6B6E'}" font-weight="${s?700:500}">${n}</text>`;
  };
  for(let i=0;i<16;i++){ draw(i+1, i, true); draw(32-i, i, false) }
  return `<svg class="chart-svg" viewBox="0 0 640 236" aria-hidden="true"><line x1="0" y1="124" x2="640" y2="124" stroke="#E3ECED"/><line x1="320" y1="0" x2="320" y2="236" stroke="#E3ECED" stroke-dasharray="4 4"/>${out}</svg>`;
}
SCREENS.chart = () => shell("patients/lee/chart","Jordan Lee","Age 46 · Last visit Feb 10",1, `
  ${chartSVG()}
  <div class="legend"><span><i style="background:#E8A33D"></i>Planned</span><span><i style="background:var(--teal)"></i>Existing</span><span><i style="background:#ddd"></i>Missing</span></div>
  <div class="rows"><div class="r"><span>Treatment plan</span><span>Tooth</span><span>Fee</span><span>Est. ins.</span></div><div class="r"><span>Crown, porcelain</span><span>#3</span><span>$1,180</span><span>$590</span></div><div class="r"><span>Filling, 2 surface</span><span>#14</span><span>$215</span><span>$172</span></div></div>`);

/* --- Speech helpers (preview uses the browser's built-in voices) --- */
const TTS = "speechSynthesis" in window;
function pickVoices(){
  const v = TTS ? speechSynthesis.getVoices().filter(x=>/^en/i.test(x.lang)) : [];
  const amy = v.find(x=>/samantha|zira|jenny|aria|female|google us english|victoria|karen|serena|ava|allison/i.test(x.name)) || v[0] || null;
  const pt = v.find(x=>x!==amy && /daniel|alex|guy|male|fred|tom|google uk english male|aaron/i.test(x.name)) || v.find(x=>x!==amy) || amy;
  return {amy, pt};
}
if(TTS){ speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = ()=>{} }
function say(text, who, hooks){
  return new Promise(res=>{
    if(!TTS){ res(); return }
    const u = new SpeechSynthesisUtterance(text), vs = pickVoices();
    if(vs[who]) u.voice = vs[who];
    u.rate = who==="amy" ? 1.03 : 1; u.pitch = who==="amy" ? 1.1 : .9;
    let done = false; const fin = ()=>{ if(!done){ done=true; hooks?.end?.(); res() } };
    u.onstart = ()=>hooks?.start?.(); u.onend = fin; u.onerror = fin;
    setTimeout(fin, text.length*95 + 2500);
    speechSynthesis.speak(u);
  });
}
function waveLoop(bars, getAmp){ return setInterval(()=>{ const a = getAmp(); bars.forEach(b=>b.style.height = (4 + Math.random()*a) + "px") }, 110) }

/* --- Amy sample calls: play when shown, audio on request (every [data-call] card) --- */
const CALLS = {
  confirm: {pt:"Maya", secs:34, lines:[["amy","Hi there, this is Amy calling from Lakeside Dental. Do I have Maya Ortiz on the line?"],["pt","Yes, this is Maya."],["amy","I'm calling about your appointment on Friday, November 13 at 9:30 AM. Can you still make it?"],["pt","Yes, I'll be there."],["amy","Great! We have you confirmed for Friday, November 13 at 9:30 AM. Please remember to arrive 15 minutes early for your appointment. We look forward to seeing you on Friday, November 13. Have a great day!"]]},
  preauth: {pt:"Jordan", secs:57, lines:[["amy","Hi there, this is Amy calling from Lakeside Dental. Do I have Jordan Lee on the line?"],["pt","Yes, this is Jordan."],["amy","To protect your privacy, can you confirm your date of birth?"],["pt","March 4th, 1980."],["amy","Thank you. Good news: your insurance approved the preauthorization for your crown on tooth number three."],["pt","Great. What happens next?"],["amy","We can book the crown appointment now. I have Tuesday at 9 or Thursday at 2. Which works better?"],["pt","Thursday at 2."],["amy","You're booked for Thursday at 2 PM. We'll text you a reminder the day before."]]}
};
const callCards = [];
document.querySelectorAll("[data-call]").forEach(card=>{
  const C = CALLS[card.dataset.call], lines = card.querySelector(".lines"), wave = card.querySelector(".wave"), timeEl = card.querySelector(".call-time"), result = card.querySelector(".call-result");
  const btns = [...document.querySelectorAll(`[data-call-play="${card.id}"]`)];
  wave.innerHTML = "<i></i>".repeat(32); const bars = [...wave.children];
  let speaker = null, run = 0, secs = 0, audio = false, player = null;
  const line = (who,text,i) => `<div class="cl ${who==="amy"?"amy":""}" data-i="${i}"><b>${who==="amy"?"Amy":C.pt}</b><span>${text}</span></div>`;
  const fmt = n => Math.floor(n/60)+":"+String(n%60).padStart(2,"0");
  const rest = ()=>{ lines.innerHTML = C.lines.map(([w,t],i)=>line(w,t,i)).join(""); lines.classList.remove("playing"); result.hidden = false; wave.hidden = true; timeEl.textContent = fmt(C.secs) };
  const label = t => btns.forEach(b=>b.querySelector("span").textContent = t);
  rest();
  if(!REDUCE) waveLoop(bars, ()=> speaker==="amy" ? 40 : speaker==="pt" ? 18 : 2);
  setInterval(()=>{ if(speaker){ secs++; timeEl.textContent = fmt(secs) } }, 1000);
  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  /* Recorded call: play the audio and follow along in the transcript */
  function playRecording(){
    run++; audio = true; result.hidden = true; wave.hidden = false; lines.classList.add("playing");
    if(!player){ player = new Audio(C.audio); player.preload = "auto";
      player.addEventListener("timeupdate", ()=>{
        if(!audio) return;
        const t = player.currentTime; timeEl.textContent = fmt(Math.floor(t));
        let cur = -1; C.lines.forEach(([,,s],i)=>{ if(s <= t) cur = i });
        speaker = cur >= 0 ? C.lines[cur][0] : null;
        lines.querySelectorAll(".cl").forEach((el,i)=>{ el.classList.toggle("now", i===cur); el.classList.toggle("later", i>cur) });
        const el = lines.querySelector(".cl.now"); if(el && el.dataset.i !== lines.dataset.cur){ lines.dataset.cur = el.dataset.i; lines.scrollTo({top: el.offsetTop - lines.offsetTop - 40, behavior: REDUCE ? "auto" : "smooth"}) }
      });
      player.addEventListener("ended", ()=>{ audio = false; speaker = null; label("Hear it with audio"); rest(); lines.scrollTop = 0 });
    }
    lines.scrollTop = 0; delete lines.dataset.cur; player.currentTime = 0;
    player.play().then(()=>label("Stop")).catch(()=>{ audio = false; rest() });
  }
  async function play(withAudio){
    if(C.audio){ if(withAudio) playRecording(); else rest(); return }
    if(REDUCE && !withAudio){ rest(); return }
    const id = ++run; audio = withAudio; secs = 0; timeEl.textContent = "0:00"; lines.innerHTML = ""; result.hidden = true; wave.hidden = false;
    label(withAudio ? "Stop" : "Hear it with audio");
    for(const [who,text] of C.lines){
      if(id!==run) return;
      lines.insertAdjacentHTML("beforeend", line(who,text)); speaker = who;
      if(withAudio && TTS) await say(text, who); else await sleep(REDUCE ? 0 : 500 + text.length*18);
      if(id!==run) return;
      speaker = null; await sleep(REDUCE ? 0 : 250);
    }
    result.hidden = false; wave.hidden = true; audio = false; label("Hear it with audio");
  }
  function stop(){ run++; speaker = null; if(player) player.pause(); if(audio && TTS && !C.audio) speechSynthesis.cancel(); audio = false; label("Hear it with audio"); rest() }
  card._play = play; card._stop = stop; callCards.push(card);
  btns.forEach(b=>b.onclick = ()=>{
    if(audio){ stop(); return }
    callCards.forEach(c=>{ if(c!==card) c._stop() });
    if(TTS) speechSynthesis.cancel();
    track("amy_sample_call",{call:card.dataset.call}); play(true);
  });
  if(!card.closest(".kf-panel")){ let done = false; onVisible(card, v=>{ if(v && !done){ done = true; play(false) } }) }
});

/* --- Amy in the chat widget: voice replies and talk --- */
window.amyVoice = { on:false };
(function(){
  const speakBtn = document.getElementById("cbSpeak"), talkBtn = document.getElementById("cbTalk"), av = document.getElementById("cbAv");
  const bars = [...document.querySelectorAll("#cbWave i")]; let talking = false;
  if(!REDUCE) waveLoop(bars, ()=> talking ? 12 : 0);
  const setSpeak = on => { window.amyVoice.on = on; speakBtn.classList.toggle("on", on); speakBtn.setAttribute("aria-pressed", on); if(!on && TTS) speechSynthesis.cancel() };
  speakBtn.onclick = ()=> setSpeak(!window.amyVoice.on);
  if(!TTS){ speakBtn.hidden = true }
  window.amySpeak = html => {
    if(!window.amyVoice.on || !TTS) return;
    const d = document.createElement("div"); d.innerHTML = html; d.querySelectorAll("button").forEach(b=>b.remove());
    const text = d.textContent.replace(/\[[^\]]*\]/g,"").replace(/\s+([.,])/g,"$1").replace(/\s{2,}/g," ").trim();
    speechSynthesis.cancel();
    say(text, "amy", {start:()=>{ talking=true; av.classList.add("talking") }, end:()=>{ talking=false; av.classList.remove("talking") }});
  };
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  talkBtn.onclick = ()=>{
    setSpeak(true);
    const bodyEl = document.getElementById("cbBody");
    const note = msg => { bodyEl.insertAdjacentHTML("beforeend", `<div class="cb-msg bot">${msg}</div>`); bodyEl.scrollTop = bodyEl.scrollHeight; window.amySpeak(msg) };
    if(rec){ rec.stop(); return }
    if(!SR){ note("<p>Voice replies are on, so I'll answer out loud. Talking to me by microphone works on the live site. Here, type your question.</p>"); return }
    try{
      rec = new SR(); rec.lang = "en-US"; rec.interimResults = false;
      rec.onstart = ()=>{ talkBtn.classList.add("on"); talkBtn.lastChild.textContent = "Listening…" };
      rec.onresult = e=>{ const q = e.results[0][0].transcript; const inp = document.getElementById("cbInput"); inp.value = q; document.getElementById("cbForm").requestSubmit() };
      rec.onerror = ()=>{ note("<p>I couldn't use the microphone here, but voice replies are on. Talking to me works on the live site. For now, type your question and I'll answer out loud.</p>") };
      rec.onend = ()=>{ rec = null; talkBtn.classList.remove("on"); talkBtn.lastChild.textContent = "Talk now" };
      rec.start();
    }catch(err){ rec = null; note("<p>Voice replies are on. Talking to me by microphone works on the live site. Here, type your question.</p>") }
  };
  document.getElementById("cbX").addEventListener("click", ()=>{ if(TTS) speechSynthesis.cancel() });
})();

/* ===================== v5: live dashboard, photo slots, nav ===================== */
/* --- Live practice dashboard (sample data) --- */
const OFFICES = {all:["All offices",3.1],lake:["Lakeside",1.2],north:["Northside",1.0],west:["Westlake",0.9]};
const PERIODS = {week:{name:"Week",labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],base:6200,days:7},month:{name:"Month",labels:["Mar 1","Mar 6","Mar 11","Mar 16","Mar 21","Mar 26"],base:30500,days:30},quarter:{name:"Quarter",labels:[...Array(13)].map((_,i)=>"W"+(i+1)),base:14500,days:91}};
const INSIGHTS = [
  ["Hygiene recall at Westlake is 12% behind target. Amy can call 38 overdue patients.","Ask Amy to call","38 calls queued for Amy"],
  ["6 claims at Northside are unpaid after 30 days. AI billing has already sent follow-ups.","Review claims","Opened in AI billing"],
  ["Thursday afternoon has 9 open hygiene slots. Offer them to patients on the waitlist?","Text the waitlist","Waitlist texted"],
  ["Collections are up 6% on last month, led by Lakeside crowns.","Share with owners","Sent to owners"]
];
function rng(seed){ let t = seed>>>0; return ()=>{ t += 0x6D2B79F5; let r = Math.imul(t ^ t>>>15, 1|t); r ^= r + Math.imul(r ^ r>>>7, 61|r); return ((r ^ r>>>14)>>>0)/4294967296 } }
const hash = s => [...s].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619), 2166136261);
const kfmt = v => v>=1000 ? "$"+(v/1000).toFixed(v>=100000?0:1).replace(/\.0$/,"")+"k" : "$"+Math.round(v);
function dashData(p, o){
  const P = PERIODS[p], f = OFFICES[o][1], R = rng(hash(p+o));
  const coll = P.labels.map((_,i)=>{ let v = P.base*f*(.82 + R()*.36 + i*.012); if(p==="week" && i===5) v*=.4; if(p==="week" && i===6) v*=.06; return Math.round(v) });
  const prod = coll.map(v=>Math.round(v*(1.03 + R()*.05)));
  const C = coll.reduce((a,b)=>a+b,0), Pr = prod.reduce((a,b)=>a+b,0);
  return {coll, prod, labels:P.labels, C, Pr, rate:C/Pr*100, hours:Math.round(f*P.days*1.9), claims:Math.round(f*P.days*9.5), dC:(3+R()*6).toFixed(1), dP:(2+R()*5).toFixed(1)};
}
function dashChart(d){
  const W=600, H=190, L=46, B=24, T=10, n=d.labels.length;
  const top = Math.max(...d.prod), step = Math.pow(10, Math.floor(Math.log10(top))), max = Math.ceil(top/step*2)/2*step;
  const x = i => L + (W-L-12)*i/(n-1), y = v => T + (H-T-B)*(1 - v/max);
  const line = arr => arr.map((v,i)=>`${i?"L":"M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const grid = [0,.5,1].map(t=>`<line x1="${L}" x2="${W-12}" y1="${y(max*t)}" y2="${y(max*t)}" stroke="#E3ECED"/><text x="${L-8}" y="${y(max*t)+3.5}" text-anchor="end" font-size="10" fill="#5B6B6E" font-family="Inter,sans-serif">${kfmt(max*t)}</text>`).join("");
  const xl = d.labels.map((l,i)=> (n<=7 || i%2===0 || i===n-1) ? `<text x="${x(i)}" y="${H-6}" text-anchor="middle" font-size="10" fill="#5B6B6E" font-family="Inter,sans-serif">${l}</text>` : "").join("");
  const last = n-1;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Collections and production chart, sample data">${grid}
    <path class="area" d="${line(d.coll)} L${x(last)} ${y(0)} L${x(0)} ${y(0)} Z" fill="var(--teal)" fill-opacity=".12"/>
    <path class="draw" d="${line(d.prod)}" fill="none" stroke="var(--aqua)" stroke-width="2" stroke-dasharray="5 4" style="animation:none;stroke-dasharray:5 4;stroke-dashoffset:0"/>
    <path class="draw" d="${line(d.coll)}" fill="none" stroke="var(--teal)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
    ${d.coll.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${i===last?4.5:2.5}" fill="${i===last?'var(--teal-dark)':'#fff'}" stroke="var(--teal)" stroke-width="1.6"><title>${d.labels[i]}: ${money(v)} collected</title></circle>`).join("")}
    ${xl}</svg>`;
}
function dashKpis(d){
  return `<div class="tile"><span>Collections</span><b data-v="${d.C}" data-f="m">${money(d.C)}</b><span class="delta">▲ ${d.dC}%</span></div>
    <div class="tile"><span>Production</span><b data-v="${d.Pr}" data-f="m">${money(d.Pr)}</b><span class="delta">▲ ${d.dP}%</span></div>
    <div class="tile"><span>Collection rate</span><b data-v="${d.rate.toFixed(1)}" data-f="p">${d.rate.toFixed(1)}%</b><span class="delta">On target</span></div>
    <div class="tile"><span>Claims sent</span><b data-v="${d.claims}" data-f="n">${d.claims}</b><span class="delta" style="color:var(--ai-deep)">by AI billing</span></div>`;
}
function dashBody(p, o){
  const d = dashData(p, o);
  return `<div class="dash" data-period="${p}" data-office="${o}" data-ins="0">
    <div class="dash-ctrl">
      <div class="seg" role="group" aria-label="Period">${Object.entries(PERIODS).map(([k,v])=>`<button type="button" data-p="${k}" aria-pressed="${k===p}">${v.name}</button>`).join("")}</div>
      <select class="dash-office" aria-label="Office">${Object.entries(OFFICES).map(([k,v])=>`<option value="${k}" ${k===o?"selected":""}>${v[0]}</option>`).join("")}</select>
      <span class="upd">Updated just now</span><span class="live-dot">Live</span>
    </div>
    <div class="tiles dash-kpis">${dashKpis(d)}</div>
    <div class="dash-chart">${dashChart(d)}<div class="dash-legend"><span><i style="background:var(--teal)"></i>Collections</span><span><i style="background:var(--aqua)"></i>Production</span></div></div>
    <div class="dash-bottom">
      <div class="insight"><span class="ih"><span class="spark sm"></span>AI insight</span><div class="it"><p>${INSIGHTS[0][0]}</p></div><button type="button" class="ins-act">${INSIGHTS[0][1]}</button></div>
      <div class="autos"><span class="ah">Automations</span>
        <div class="auto"><span>Weekly report to owners · Mon 7 AM</span><button type="button" class="auto-toggle" aria-pressed="true" aria-label="Weekly report email"></button></div>
        <div class="auto"><span>Month-end summary to accountant</span><button type="button" class="auto-toggle" aria-pressed="false" aria-label="Month-end summary email"></button></div>
      </div>
    </div></div>`;
}
SCREENS.reports = () => shell("reports","Practice dashboard","",5, dashBody("month","all"));
TOUR.reports = ["Reports","Dashboards that update themselves. Pick a period or an office, and AI points out what needs attention.",["Live collections and production","Weekly reports emailed automatically","AI insights with one-click actions"]];
function countTo(el, to, f){
  const from = parseFloat(el.dataset.v)||0; el.dataset.v = to;
  const fmt = v => f==="m" ? money(v) : f==="p" ? v.toFixed(1)+"%" : Math.round(v).toString();
  if(REDUCE){ el.textContent = fmt(to); return }
  const t0 = performance.now(); const step = t=>{ const k = Math.min(1,(t-t0)/600), e = 1-Math.pow(1-k,3); el.textContent = fmt(from + (to-from)*e); if(k<1) requestAnimationFrame(step) }; requestAnimationFrame(step);
}
function updateDash(dash){
  const p = dash.dataset.period, o = dash.dataset.office, d = dashData(p, o);
  dash.querySelectorAll("[data-p]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.p===p));
  const vals = [[d.C,"m"],[d.Pr,"m"],[+d.rate.toFixed(1),"p"],[d.hours,"n"]];
  dash.querySelectorAll(".dash-kpis b").forEach((b,i)=>countTo(b, vals[i][0], vals[i][1]));
  const deltas = dash.querySelectorAll(".dash-kpis .delta"); deltas[0].textContent = "▲ "+d.dC+"%"; deltas[1].textContent = "▲ "+d.dP+"%";
  dash.querySelector(".dash-chart svg").outerHTML = dashChart(d);
  dash.querySelector(".upd").textContent = "Updated just now";
}
function setInsight(dash, i){
  dash.dataset.ins = i; const [t,a] = INSIGHTS[i];
  dash.querySelector(".it").outerHTML = `<div class="it"><p>${t}</p></div>`;
  const b = dash.querySelector(".ins-act"); b.textContent = a; b.classList.remove("done"); b.disabled = false;
}
document.addEventListener("click", e=>{
  const dash = e.target.closest(".dash"); if(!dash) return;
  const pb = e.target.closest("[data-p]"); if(pb){ dash.dataset.period = pb.dataset.p; updateDash(dash); track("dash_period",{p:pb.dataset.p}); return }
  const act = e.target.closest(".ins-act"); if(act && !act.classList.contains("done")){ act.textContent = "✓ " + INSIGHTS[+dash.dataset.ins][2]; act.classList.add("done"); dash.dataset.lock = "1"; setTimeout(()=>{ delete dash.dataset.lock }, 6000); return }
  const tg = e.target.closest(".auto-toggle"); if(tg){ tg.setAttribute("aria-pressed", tg.getAttribute("aria-pressed")!=="true") }
});
document.addEventListener("change", e=>{ const s = e.target.closest(".dash-office"); if(s){ const dash = s.closest(".dash"); dash.dataset.office = s.value; updateDash(dash) } });
if(!REDUCE){
  let tick = 0;
  setInterval(()=>{
    tick++;
    document.querySelectorAll(".dash").forEach(dash=>{
      if(!dash.offsetParent) return;
      const b = dash.querySelector(".dash-kpis b"); countTo(b, parseFloat(b.dataset.v) + pick([64,142,215,380]), "m"); bump(b);
      const u = dash.querySelector(".upd"); u.textContent = "Payment posted just now";
      if(tick % 2 === 0 && !dash.dataset.lock) setInsight(dash, (+dash.dataset.ins + 1) % INSIGHTS.length);
    });
  }, 4200);
  const lb = document.querySelector(".bento .bars .cur");
  if(lb) setInterval(()=>{ lb.style.transition = "height .6s"; lb.style.height = (80 + Math.random()*18) + "%" }, 2600);
}

/* --- v6: use the operatory photo (images/modern-dental-operatory.jpg in production) --- */
document.querySelectorAll(".hero-img, [data-office]").forEach(el=>{ el.classList.add("has-photo"); el.insertAdjacentHTML("afterbegin",'<div class="hp-blur"></div><div class="hp-sharp"></div>') });

/* ===================== Patient app (sample, interactive) ===================== */
const PA_ICO = {
  home:'<path d="M4 11l8-6.5 8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>', cal:P.calendar, fam:P.users, bill:P.billing,
  plan:P.tooth, ins:P.shield, me:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.8-5.5 7-5.5s6.2 1.9 7 5.5"/>', bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'
};
const paI = (n,s=18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PA_ICO[n]}</svg>`;
const PA_VIEWS = {
  home: st => `
    <div class="pa-card pa-next"><small>Next visit · Lakeside Dental</small><b>${st.appt}</b><small>Cleaning with Sarah, RDH</small>
      ${st.apptState ? `<span class="pa-done">${st.apptState}</span>` : `<div class="pa-btns"><button type="button" data-pa-act="resched">Reschedule</button><button type="button" data-pa-act="cancel">Cancel</button></div>`}</div>
    <div class="pa-grid">
      <button type="button" data-pa-act="book">${paI("cal")}Book</button>
      <button type="button" data-pa-tab="visits">${paI("cal")}My visits</button>
      <button type="button" data-pa-tab="ins">${paI("ins")}Insurance</button>
      <button type="button" data-pa-tab="family">${paI("fam")}Family</button>
      <button type="button" data-pa-tab="me">${paI("me")}My info</button>
      <button type="button" data-pa-tab="bill">${paI("bill")}Pay bill</button>
    </div>
    <div class="pa-card"><p class="pa-h" style="margin-bottom:8px">Reminders</p>
      <div class="pa-note"><i></i><span>Cleaning ${st.appt}<small>Today, 8:00 AM</small></span></div>
      <div class="pa-note"><i></i><span>Leo's checkup Wed, Apr 2 · 3:30 PM<small>Yesterday</small></span></div>
    </div>`,
  visits: st => `
    <p class="pa-h">Upcoming</p>
    <div class="pa-card"><div class="pa-row"><span><b>${st.appt}</b><small>Cleaning · Maya</small></span><button type="button" class="pa-link" data-pa-act="resched">Reschedule</button></div>
      <div class="pa-row"><span><b>Wed, Apr 2 · 3:30 PM</b><small>Checkup · Leo</small></span><button type="button" class="pa-link" data-pa-tab="family">Family</button></div>
      ${st.booked ? `<div class="pa-row"><span><b>Tue, Apr 8 · 8:30 AM</b><small>Cleaning · Ana · just booked</small></span><span class="pill p-ok">Booked</span></div>` : ""}</div>
    <button type="button" class="pa-pay ${st.booked?'done':''}" data-pa-act="book">${st.booked ? "✓ Booked: Tue, Apr 8 · 8:30 AM" : "Book a new visit"}</button>
    <p class="pa-h">Past visits</p>
    <div class="pa-card"><div class="pa-row"><span><b>Feb 10</b><small>Exam and X-rays · Maya</small></span></div><div class="pa-row"><span><b>Sep 4</b><small>Cleaning · Maya</small></span></div></div>`,
  family: st => `
    <p class="pa-h">Family members</p>
    <div class="pa-card">
      <div class="pa-row"><span><b>Maya Ortiz</b><small>You · next visit ${st.appt}</small></span></div>
      <div class="pa-row"><span><b>Leo Ortiz, 9</b><small>Dependent · checkup Wed, Apr 2</small></span><button type="button" class="pa-link" data-pa-tab="visits">Manage</button></div>
      <div class="pa-row"><span><b>Ana Ortiz, 6</b><small>Dependent · ${st.booked ? "cleaning Tue, Apr 8" : "due for a cleaning"}</small></span>${st.booked ? "" : `<button type="button" class="pa-link" data-pa-act="book">Book</button>`}</div>
    </div>
    <button type="button" class="pa-pay" style="background:#fff;color:var(--teal-dark);border:1px solid var(--border)">+ Add a family member</button>`,
  ins: st => `
    <p class="pa-h">Your coverage</p>
    <div class="pa-card"><div class="pa-row"><span><b>Sample PPO</b><small>Member ID ••••4821</small></span><span class="pill p-ok">Active</span></div>
      <div class="pa-row"><span>Preventive</span><b>100%</b></div>
      <div class="pa-row"><span>Basic</span><b>80%</b></div>
      <div class="pa-row"><span>Annual max remaining</span><b>$1,150</b></div>
      <div class="pa-row"><span>Last checked</span><span>${st.verified ? "Just now" : "Mar 1"}</span></div>
      <button type="button" class="pa-pay ${st.verified?'done':''}" data-pa-act="verify">${st.verified ? "✓ Coverage verified" : "Check my coverage"}</button></div>
    <div class="pa-card pa-soon-card"><span class="soon">Coming soon</span><p>Preauthorization updates in the app.</p></div>`,
  bill: st => `
    <p class="pa-h">Your balance</p>
    <div class="pa-card"><div class="pa-row"><span><b>Cleaning · Feb 10</b><small>After insurance</small></span><b>$45.00</b></div>
      <div class="pa-row"><span><b>Card on file</b><small>Visa ••••4242</small></span></div>
      <button type="button" class="pa-pay ${st.paid?'done':''}" data-pa-act="pay">${st.paid ? "✓ Paid $45.00 · receipt emailed" : "Pay $45.00"}</button></div>
    ${st.paid ? '<p class="pa-h" style="color:var(--ok)">✓ Payment received. The office sees it right away.</p>' : ""}`,
  me: st => `
    <p class="pa-h">My info</p>
    <div class="pa-card">
      <div class="pa-row"><span><small>Phone</small><b>${st.phone}</b></span><button type="button" class="pa-link" data-pa-act="phone">Edit</button></div>
      <div class="pa-row"><span><small>Email</small><b>maya.o@example.com</b></span><button type="button" class="pa-link">Edit</button></div>
      <div class="pa-row"><span><small>Address</small><b>412 Lake St, Minneapolis</b></span><button type="button" class="pa-link">Edit</button></div>
      <div class="pa-row"><span><small>Reminders</small><b>Text and email</b></span><button type="button" class="pa-link">Edit</button></div>
    </div>${st.saved ? '<p class="pa-h" style="color:var(--ok)">✓ Details updated. The office sees it right away.</p>' : ""}`
};
function paRender(root){
  const st = root._st, tab = st.tab;
  const greet = {home:["Hi, Maya","Lakeside Dental"],visits:["Visits","Book and manage appointments"],family:["Family","Manage dependents and their visits"],ins:["Insurance","Check your coverage"],bill:["Billing","Pay your balance"],me:["My info","Keep your details current"]}[tab];
  root.innerHTML = `<div class="pa">
    <div class="pa-top"><span><b>${greet[0]}</b><small>${greet[1]}</small></span><button type="button" class="pa-av" data-pa-tab="me" aria-label="My info">MO</button></div>
    <div class="pa-body">${PA_VIEWS[tab](st)}</div>
    <nav class="pa-nav" aria-label="Patient app">${[["home","Home","home"],["visits","Visits","cal"],["family","Family","fam"],["ins","Insurance","ins"]].map(([k,l,i])=>`<button type="button" data-pa-tab="${k}" aria-pressed="${tab===k}">${paI(i,17)}${l}</button>`).join("")}</nav>
  </div><span class="sample" style="bottom:68px">Sample app</span>`;
}
SCREENS.patientapp = () => `<div class="app-body pa-wrap" data-pa-root></div>`;
function paInit(){ document.querySelectorAll("[data-pa-root]").forEach(r=>{ if(!r._st){ r._st = {tab:"home", appt:"Thu, Mar 12 · 9:00 AM", phone:"(612) 555-0148"}; paRender(r) } }) }
document.addEventListener("click", e=>{
  const root = e.target.closest("[data-pa-root]"); if(!root) return;
  const st = root._st, t = e.target.closest("[data-pa-tab]"), a = e.target.closest("[data-pa-act]");
  if(t){ st.tab = t.dataset.paTab; paRender(root); return }
  if(a){
    const k = a.dataset.paAct;
    if(k==="resched"){ st.appt = "Fri, Mar 13 · 10:30 AM"; st.apptState = "✓ Rescheduled. The office has been notified."; }
    if(k==="cancel"){ st.apptState = "Cancelled. We'll text you to rebook."; }
    if(k==="book"){ st.booked = true; st.tab = "visits"; }
    if(k==="verify"){ st.verified = true; }
    if(k==="pay"){ st.paid = true; }
    if(k==="phone"){ st.phone = "(612) 555-0199"; st.saved = true; }
    track("patient_app_demo",{action:k}); paRender(root);
  }
});


/* --- Patient app screenshots: switch automatically, or by tab (every .shots block) --- */
document.querySelectorAll(".shots").forEach(box=>{
  const imgs = [...box.querySelectorAll(".shot-img")], tabs = [...box.querySelectorAll("[data-shot]")];
  let i = 0, user = false, visible = false;
  const show = k => { i = k; imgs.forEach((im,j)=>im.classList.toggle("on", j===k)); tabs.forEach((t,j)=>t.setAttribute("aria-selected", j===k)) };
  tabs.forEach(t=>t.onclick=()=>{ user = true; show(+t.dataset.shot) });
  onVisible(box, v=>visible=v);
  if(!REDUCE) setInterval(()=>{ if(!user && visible && !document.hidden) show((i+1)%imgs.length) }, 4000);
});

/* --- Key features: tabbed, plays on its own until someone picks a tab --- */
function playScribe(el){
  if(REDUCE) return;
  el.classList.remove("play"); void el.offsetWidth; el.classList.add("play");
  const t = el.querySelector(".sc-time"); let n = 0; clearInterval(el._t);
  el._t = setInterval(()=>{ n++; t.textContent = "0:" + String(n).padStart(2,"0"); if(n>=42) clearInterval(el._t) }, 70);
}
(function(){
  const wrap = document.querySelector(".kf-sum"); if(!wrap) return;
  const tabs = [...wrap.querySelectorAll("[data-kf]")], band = document.getElementById("tour");
  let auto = !REDUCE, cur = 0;
  function show(i, focus){
    cur = i;
    tabs.forEach((t,j)=>{ const on = j===i; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; document.getElementById(t.getAttribute("aria-controls")).hidden = !on; if(on && focus) t.focus() });
    const pnl = document.getElementById(tabs[i].getAttribute("aria-controls"));
    pnl.querySelectorAll("[data-scribe]").forEach(playScribe);
    document.querySelectorAll(".kf-panel [data-call]").forEach(c=>{ if(!pnl.contains(c) && c._stop) c._stop() });
    pnl.querySelectorAll("[data-call]").forEach(c=>c._play && c._play(false));
    wrap.classList.remove("playing"); void wrap.offsetWidth; if(auto) wrap.classList.add("playing");
  }
  const stop = ()=>{ auto = false; wrap.classList.remove("playing") };
  tabs.forEach((t,i)=>t.addEventListener("click", ()=>{ stop(); show(i); track("key_feature_tab",{feature:t.dataset.kf}) }));
  wrap.addEventListener("keydown", e=>{ if(e.key==="ArrowRight" || e.key==="ArrowLeft"){ e.preventDefault(); stop(); show((cur + (e.key==="ArrowRight" ? 1 : tabs.length-1)) % tabs.length, true) } });
  wrap.addEventListener("animationend", e=>{ if(auto && e.target.classList.contains("prog")) show((cur+1) % tabs.length) });
  [wrap, ...band.querySelectorAll(".kf-panel")].forEach(el=>{ el.addEventListener("mouseenter", ()=>wrap.classList.add("paused")); el.addEventListener("mouseleave", ()=>wrap.classList.remove("paused")) });
  onVisible(band, v=>wrap.classList.toggle("paused", !v));
  show(0);
})();
document.querySelectorAll("[data-scribe]").forEach(el=>{ if(!el.closest(".kf-panel")){ let done = false; onVisible(el, v=>{ if(v && !done){ done = true; playScribe(el) } }) } });

renderScreens(document);
paInit();
setTour("schedule");
if(document.getElementById("c-share")) calc();
