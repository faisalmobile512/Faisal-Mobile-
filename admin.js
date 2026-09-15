const cfg = window.FAISAL_CONFIG || {};
const ready = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("PASTE_") && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes("PASTE_");
let db = null, editingImageUrl = "";

const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const msg = document.getElementById("loginMsg");
const productMsg = document.getElementById("productMsg");

if(ready) db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
else msg.innerHTML = "First connect Supabase in <b>config.js</b>. The rest of the admin panel is already prepared.";

function showMessage(el,text,error=false){ el.textContent=text; el.className="message "+(error?"error":"success"); }

async function init(){
  if(!db) return;
  const {data:{session}} = await db.auth.getSession();
  if(session) showPanel();
}
async function showPanel(){ loginBox.classList.add("hidden"); panel.classList.remove("hidden"); await loadAdminProducts(); }
document.getElementById("loginForm").addEventListener("submit", async e=>{
  e.preventDefault();
  if(!db) return;
  const {error} = await db.auth.signInWithPassword({email:email.value.trim(), password:password.value});
  if(error) showMessage(msg,error.message,true); else { msg.textContent=""; showPanel(); }
});
document.getElementById("logoutBtn").onclick = async ()=>{ if(db) await db.auth.signOut(); panel.classList.add("hidden"); loginBox.classList.remove("hidden"); };
document.getElementById("cancelEdit").onclick = resetForm;

image.addEventListener("change", ()=>{
  const f=image.files[0]; if(f) imagePreview.innerHTML=`<img src="${URL.createObjectURL(f)}" alt="Preview">`;
});

document.getElementById("productForm").addEventListener("submit", async e=>{
  e.preventDefault(); if(!db) return;
  productMsg.textContent="";
  const id=productId.value;
  let imageUrl=editingImageUrl;
  const file=image.files[0];
  if(file){
    const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
    const path=`${crypto.randomUUID()}.${ext}`;
    const up=await db.storage.from("product-images").upload(path,file,{upsert:false});
    if(up.error){ showMessage(productMsg,up.error.message,true); return; }
    imageUrl=db.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }
  const payload={brand:brand.value.trim(),name:name.value.trim(),price:price.value.trim(),description:description.value.trim(),wa_text:waText.value.trim(),image_url:imageUrl,available:available.checked};
  const result=id ? await db.from("products").update(payload).eq("id",id) : await db.from("products").insert(payload);
  if(result.error){ showMessage(productMsg,result.error.message,true); return; }
  showMessage(productMsg,id?"Product updated.":"Product added.");
  resetForm(); await loadAdminProducts();
});
async function loadAdminProducts(){
  const el=document.getElementById("adminProducts");
  const {data,error}=await db.from("products").select("*").order("created_at",{ascending:false});
  if(error){el.textContent=error.message;return;}
  el.innerHTML=data?.length ? data.map(p=>`
    <div class="admin-row">
      <div class="thumb">${p.image_url?`<img src="${p.image_url}" alt="">`:"📱"}</div>
      <div class="row-info"><b>${esc(p.name)}</b><span>${esc(p.brand)} • ${esc(p.price)}</span><small>${p.available?"Available":"Out of stock"}</small></div>
      <button class="mini" onclick='editProduct(${JSON.stringify(p).replace(/'/g,"&#39;")})'>Edit</button>
      <button class="mini danger" onclick="deleteProduct('${p.id}')">Delete</button>
    </div>`).join("") : "<p>No products yet.</p>";
}
window.editProduct=(p)=>{
  productId.value=p.id; brand.value=p.brand||""; name.value=p.name||""; price.value=p.price||""; description.value=p.description||""; waText.value=p.wa_text||""; available.checked=!!p.available; editingImageUrl=p.image_url||"";
  imagePreview.innerHTML=p.image_url?`<img src="${p.image_url}" alt="">`:"";
  window.scrollTo({top:0,behavior:"smooth"});
};
window.deleteProduct=async id=>{
  if(!confirm("Delete this product?")) return;
  const {error}=await db.from("products").delete().eq("id",id);
  if(error) alert(error.message); else loadAdminProducts();
};
function resetForm(){ productId.value=""; brand.value=""; name.value=""; price.value=""; description.value=""; waText.value=""; image.value=""; available.checked=true; editingImageUrl=""; imagePreview.innerHTML=""; }
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
init();