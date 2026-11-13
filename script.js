const menu=document.querySelector(".menu"),list=document.querySelector("nav ul");
if(menu){menu.addEventListener("click",()=>{const o=list.classList.toggle("open");menu.setAttribute("aria-expanded",o)})}
function check(form){let ok=true;
form.querySelectorAll("input,textarea").forEach(f=>{
const m=f.parentElement.querySelector(".err");let t="";
if(!f.value.trim())t="Please fill in your "+f.name+".";
else if(f.type==="email"&&!/^\S+@\S+\.\S+$/.test(f.value))t="Enter a valid email address.";
if(!t&&f.name==="pincode"&&!/^\d{6}$/.test(f.value.trim()))t="Enter a 6-digit pincode.";m.textContent=t;if(t)ok=false});return ok}
const form=document.getElementById("contact-form");
if(form){form.addEventListener("submit",e=>{e.preventDefault();
if(check(form)){document.getElementById("status").textContent="Thanks! We’ll reply within two working days.";form.reset()}})}

/* Shop and cart */
const P=[
{id:"collar",name:"Pawsense Smart Collar",price:6999,note:"GPS, health and heat tracking in one soft, water-resistant collar.",c:"#EADFCC",img:"collar.svg",opt:"Size",opts:["Small","Medium","Large"]},
{id:"dock",name:"Charging Dock",price:1299,note:"Charges the collar overnight, with no fiddly cables.",c:"#DCE5DA",img:"dock.svg"},
{id:"band",name:"Soft Replacement Band",price:899,note:"A fresh band for when the old one has seen too many monsoon walks.",c:"#F3D9C9",img:"band.svg",opt:"Colour",opts:["Oat","Sage","Blush"]},
{id:"plus",name:"Pawsense Plus, 1 year",price:2499,note:"Weekly health reports you can share with your vet.",c:"#F1E8D4",img:"plus.svg"}];
const R=n=>"₹"+n.toLocaleString("en-IN");
let cart=[];
try{cart=JSON.parse(localStorage.getItem("pawsense-cart"))||[]}catch(e){}
function count(){const el=document.getElementById("cart-count");if(el)el.textContent=cart.reduce((s,i)=>s+i.qty,0)}
function save(){try{localStorage.setItem("pawsense-cart",JSON.stringify(cart))}catch(e){}count()}
count();
const card=p=>`<article class="product"><div class="thumb" style="--c:${p.c}"><img src="images/${p.img}" alt="${p.name}"></div><h3>${p.name}</h3><p>${p.note}</p>${p.opt?`<label>${p.opt}<select>${p.opts.map(o=>`<option>${o}</option>`).join("")}</select></label>`:""}<div class="buy"><b>${R(p.price)}</b><button class="btn" data-id="${p.id}">Add to cart</button></div></article>`;
function add(e){const b=e.target.closest("button");if(!b)return;
const sel=b.closest(".product").querySelector("select"),opt=sel?sel.value:"";
const hit=cart.find(i=>i.id===b.dataset.id&&i.opt===opt);
hit?hit.qty++:cart.push({id:b.dataset.id,opt,qty:1});
save();b.textContent="Added";setTimeout(()=>b.textContent="Add to cart",1200)}
[["grid",P],["featured",P.slice(0,3)]].forEach(([id,items])=>{
const g=document.getElementById(id);if(!g)return;
g.innerHTML=items.map(card).join("");g.addEventListener("click",add)});
const lines=document.getElementById("lines"),totals=document.getElementById("totals"),co=document.getElementById("checkout");
function draw(){if(!lines)return;
co.hidden=!cart.length;
if(!cart.length){lines.innerHTML='<p>Your cart is empty. <a href="shop.html">Browse the shop</a>.</p>';totals.textContent="";return}
let sub=0;
lines.innerHTML=cart.map((i,x)=>{const p=P.find(q=>q.id===i.id);sub+=p.price*i.qty;
return `<div class="line"><div class="thumb sm" style="--c:${p.c}"><img src="images/${p.img}" alt=""></div><div><h3>${p.name}</h3><p>${i.opt}</p></div><div class="qty"><button data-x="${x}" data-d="-1" aria-label="Fewer">−</button><span>${i.qty}</span><button data-x="${x}" data-d="1" aria-label="More">+</button></div><b>${R(p.price*i.qty)}</b></div>`}).join("");
const ship=sub>=2000?0:99;
totals.innerHTML=`Subtotal ${R(sub)}<br>Shipping ${ship?R(ship):"Free"}<br><strong>Total ${R(sub+ship)}</strong>`}
if(lines){
lines.addEventListener("click",e=>{const b=e.target.closest("button[data-x]");if(!b)return;
const i=cart[b.dataset.x];i.qty+=+b.dataset.d;if(i.qty<1)cart.splice(b.dataset.x,1);save();draw()});
co.addEventListener("submit",e=>{e.preventDefault();if(!check(co))return;
const id="PS-"+Math.floor(10000+Math.random()*90000),mail=co.email.value;
cart=[];save();draw();
document.getElementById("done").textContent="Order "+id+" placed. We’ll send a confirmation to "+mail+". This is a demo, so no payment was taken."});
draw()}
