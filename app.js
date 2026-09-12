const WA='94720623232';
const products=[
{id:1,name:'Coofix Cordless Drill',category:'Power Tools',price:6890,image:'assets/products/cordless-drill.jpg',desc:'10mm cordless drill with 25Nm max torque. 6 month warranty shown in supplied artwork.'},
{id:2,name:'Coofix Electric Jigsaw',category:'Power Tools',price:8990,image:'assets/products/electric-jigsaw.jpg',desc:'500W electric jigsaw with 55mm max cutting depth.'},
{id:3,name:'Wadfow Professional Heat Gun',category:'Electrical Tools',price:null,image:'assets/products/heat-gun.jpg',desc:'1600W professional heat gun. Contact us for current price and availability.'},
{id:4,name:'Coofix Angle Grinder',category:'Power Tools',price:5590,image:'assets/products/angle-grinder.jpg',desc:'115mm Coofix angle grinder for workshop and project use.'},
{id:5,name:'INGCO 360° Tool',category:'Hand Tools',price:null,image:'assets/products/ingco-tool.jpg',desc:'INGCO tool shown in the supplied product artwork. Contact us for exact model and price.'},
{id:6,name:'Coofix Cordless Planer',category:'Power Tools',price:29990,image:'assets/products/cordless-planer.jpg',desc:'82mm planing width and up to 2mm planing depth, as shown in supplied artwork.'},
{id:7,name:'Coofix Angle Grinder 115mm',category:'Power Tools',price:5590,image:'assets/products/coofix-angle-grinder.jpg',desc:'Coofix 115mm angle grinder (CF-AG010). Contact us to confirm current stock.'},
{id:8,name:'Drill & Drill Stand Combo',category:'Accessories',price:13500,image:'assets/products/drill-stand-combo.jpg',desc:'Special combo offer featuring a 710W drill and drill stand.'},
{id:9,name:'Coofix Electric Blower',category:'Power Tools',price:9990,image:'assets/products/electric-blower.jpg',desc:'1500W electric blower, 10A, with 6 month warranty shown in supplied artwork.'},
{id:10,name:'Wall Sander 180mm',category:'Power Tools',price:null,image:'assets/products/wall-sander.jpg',desc:'180mm wall sander. Contact us for current price and availability.'}
];
const customerFiles=['786344046_122107012635447280_5105734143352591219_n.jpg','788550421_122108915241447280_6710023750446469271_n.jpg','790425269_122107379721447280_2509549255422579132_n.jpg','791179102_122107379733447280_6028499303827389280_n.jpg','791335195_122107379775447280_7648138872568064690_n.jpg','796324698_122108916585447280_8114788387420201345_n.jpg','796439405_122108916717447280_7932280296509204683_n.jpg','797337103_122108916639447280_1580331633396550432_n.jpg'];
let cart=[]; let currentProduct=null,currentQty=1;
function loadCart(){
  try{
    const raw=localStorage.getItem('samagiCart');
    const parsed=raw?JSON.parse(raw):[];
    cart=Array.isArray(parsed)?parsed.filter(i=>i && Number.isFinite(Number(i.id)) && Number(i.qty)>0):[];
  }catch(err){
    cart=[];
    try{localStorage.removeItem('samagiCart')}catch(_){}
    console.warn('Cart storage reset:',err);
  }
}
function safeSetCart(){
  try{localStorage.setItem('samagiCart',JSON.stringify(cart));return true}catch(err){console.warn('Cart could not be saved:',err);return false}
}
const $=s=>document.querySelector(s); const money=n=>n==null?'Price on request':'Rs. '+n.toLocaleString('en-LK');
function save(){safeSetCart();renderCart();}
function renderProducts(){const q=$('#search').value.toLowerCase(),f=$('#filter').value;const list=products.filter(p=>(f==='all'||p.category===f)&&(p.name+' '+p.category+' '+p.desc).toLowerCase().includes(q));$('#productGrid').innerHTML=list.map(p=>`<article class="product"><div class="productImg" data-id="${p.id}"><img loading="lazy" src="${p.image}" alt="${p.name}"></div><div class="productBody"><span class="tag">${p.category}</span><h3>${p.name}</h3><div class="productDesc">${p.desc}</div><div class="price">${money(p.price)}</div><div class="productActions"><button class="add" data-add="${p.id}">Add to Cart</button><button class="buy" data-buy="${p.id}">WhatsApp</button></div></div></article>`).join('')||'<p>No products found.</p>';}
function renderCustomers(){const g=$('#customerGrid');g.innerHTML=customerFiles.map(f=>`<div class="customer"><img loading="lazy" src="assets/customers/${f}" alt="Samagi Tools customer photo"></div>`).join('');}
function renderCart(){const count=cart.reduce((a,i)=>a+i.qty,0),total=cart.reduce((a,i)=>a+(i.price||0)*i.qty,0);$('#cartCount').textContent=count;$('#cartTotal').textContent=money(total);$('#cartItems').innerHTML=cart.length?cart.map(i=>`<div class="cartLine"><img src="${i.image}" alt=""><div><h4>${i.name}</h4><small>${money(i.price)} × ${i.qty}</small></div><div class="cartQty"><button data-dec="${i.id}">−</button><b>${i.qty}</b><button data-inc="${i.id}">+</button></div></div>`).join(''):'<p style="color:#66748b;font-size:13px">Your cart is empty.</p>';}
function add(id,qty=1){
  const p=products.find(x=>x.id===Number(id));
  if(!p){toast('Product could not be added');return;}
  const amount=Math.max(1,Number(qty)||1);
  let i=cart.find(x=>Number(x.id)===p.id);
  if(i)i.qty=Number(i.qty||0)+amount;
  else cart.push({id:p.id,name:p.name,price:p.price,image:p.image,qty:amount});
  save();
  toast(p.name+' added to cart');
}
function waMessage(items=cart){let lines=items.map((i,n)=>`${n+1}. ${i.name} x ${i.qty} - ${money(i.price)}`).join('\n');let total=items.reduce((a,i)=>a+(i.price||0)*i.qty,0);return `Hello Samagi Tools,\n\nI would like to place an order.\n\nOrder Details:\n${lines}\n\nTotal (priced items): ${money(total)}\n\nCustomer Name:\nPhone:\nDelivery Address:\nAdditional Note:\n\nThank you.`}
function buy(id){const p=products.find(x=>x.id===id);window.open(`https://wa.me/${WA}?text=${encodeURIComponent(waMessage([{...p,qty:1}]))}`,'_blank');}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
function openModal(id){currentProduct=products.find(x=>x.id===id);currentQty=1;$('#modalImg').src=currentProduct.image;$('#modalImg').alt=currentProduct.name;$('#modalCat').textContent=currentProduct.category;$('#modalName').textContent=currentProduct.name;$('#modalPrice').textContent=money(currentProduct.price);$('#modalDesc').textContent=currentProduct.desc;$('#modalQty').textContent=1;$('#productModal').classList.remove('hidden')}
function closeModal(){$('#productModal').classList.add('hidden')}
$('#search').addEventListener('input',renderProducts);$('#filter').addEventListener('change',renderProducts);$('#cartBtn').onclick=()=>$('#cartDrawer').classList.remove('hidden');$('#closeCart').onclick=()=>$('#cartDrawer').classList.add('hidden');$('#clearCart').onclick=()=>{cart=[];save()};$('#modalClose').onclick=closeModal;
$('#productGrid').addEventListener('click',e=>{const img=e.target.closest('.productImg');const a=e.target.closest('[data-add]');const b=e.target.closest('[data-buy]');if(img)openModal(+img.dataset.id);if(a)add(+a.dataset.add);if(b)buy(+b.dataset.buy)});
$('#cartItems').addEventListener('click',e=>{let id=+(e.target.dataset.inc||e.target.dataset.dec);if(!id)return;let i=cart.find(x=>x.id===id);if(e.target.dataset.inc)i.qty++;else i.qty--;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);save()});
$('#checkout').onclick=()=>{if(!cart.length)return toast('Your cart is empty');window.open(`https://wa.me/${WA}?text=${encodeURIComponent(waMessage())}`,'_blank')};$('#modalAdd').onclick=()=>{add(currentProduct.id,currentQty);closeModal()};$('#plus').onclick=()=>{$('#modalQty').textContent=++currentQty};$('#minus').onclick=()=>{$('#modalQty').textContent=Math.max(1,--currentQty)};
$('#menuBtn').onclick=()=>$('#navLinks').classList.toggle('open');document.querySelectorAll('#navLinks a').forEach(a=>a.onclick=()=>$('#navLinks').classList.remove('open'));document.querySelectorAll('.catGrid button').forEach(b=>b.onclick=()=>{$('#filter').value=b.dataset.cat;renderProducts();location.hash='shop'});
$('#prev').onclick=()=>$('#customerGrid').scrollBy({left:-260,behavior:'smooth'});$('#next').onclick=()=>$('#customerGrid').scrollBy({left:260,behavior:'smooth'});
document.addEventListener('DOMContentLoaded',()=>{
  loadCart();
  renderProducts();
  renderCustomers();
  renderCart();

  const loader=$('#loader');
  if(!loader)return;

  // Simple branded startup: show only the animated Samagi Tools logo,
  // then smoothly reveal the website. No intro video is used.
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      loader.classList.add('done');
      setTimeout(()=>loader.remove(),450);
    },1800);
  });

});
