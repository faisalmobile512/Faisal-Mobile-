const cfg = window.FAISAL_CONFIG || {};
const ready = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("PASTE_") && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes("PASTE_");
const box = document.getElementById("products");

function waLink(product){
  const msg = product.wa_text || `I want to ask about ${product.name}`;
  return `https://wa.me/${cfg.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function card(p){
  return `<article class="card product-card">
    <div class="product-image">${p.image_url ? `<img src="${p.image_url}" alt="${escapeHtml(p.name)}">` : `<div class="icon">📱</div>`}</div>
    <div class="brand">${escapeHtml(p.brand || "")}</div>
    <h3>${escapeHtml(p.name)}</h3>
    <p>${escapeHtml(p.description || "Quality mobile phone")}</p>
    <div class="price">${escapeHtml(p.price)}</div>
    <div class="stock ${p.available ? "in" : "out"}">${p.available ? "✓ Available" : "Out of Stock"}</div>
    <a class="btn" href="${waLink(p)}" target="_blank">💬 Ask on WhatsApp</a>
  </article>`;
}
function escapeHtml(v){ return String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

async function loadProducts(){
  if(!ready){ box.innerHTML = `<div class="setup-note"><h3>Website is ready</h3><p>Connect Supabase in <b>config.js</b> to show products added from the Admin Panel.</p></div>`; return; }
  const supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const {data, error} = await supabase.from("products").select("*").order("created_at",{ascending:false});
  if(error){ box.innerHTML = `<div class="setup-note">Could not load products. Check your Supabase setup.</div>`; return; }
  box.innerHTML = data?.length ? data.map(card).join("") : `<div class="setup-note">No products yet. Add your first phone from the Admin Panel.</div>`;
}
loadProducts();