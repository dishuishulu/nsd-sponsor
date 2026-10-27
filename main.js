/* ============================================================
   NSD 服务器 · 赞助页脚本
   渲染逻辑都在这里，内容修改请去 data.js
   ============================================================ */
(function () {
  "use strict";

  const D = window.NSD || {};
  const S = D.site || {};
  const tiers = Array.isArray(D.tiers) ? D.tiers : [];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------- 站点信息 ---------------- */
  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el && txt) el.textContent = txt;
  };

  setText("brandText", S.server);
  setText("heroServer", S.server);
  setText("heroSlogan", S.slogan);
  setText("footerServer", S.server);
  setText("footerNote", (D.footer || {}).note);
  if (S.title) document.title = S.title;
  $("#year").textContent = new Date().getFullYear();

  /* 公告 */
  if (S.notice) {
    const bar = $("#noticeBar");
    bar.hidden = false;
    $("#noticeText").textContent = S.notice;
    $("#noticeClose").addEventListener("click", () => (bar.hidden = true));
  }

  /* ---------------- 套餐卡片 ---------------- */
  const tiersGrid = $("#tiersGrid");
  tiersGrid.innerHTML = tiers
    .map((t) => {
      const cls = [
        "tier",
        t.highlight ? "tier--hi" : "",
        t.supreme ? "tier--supreme" : "",
        "reveal",
      ]
        .filter(Boolean)
        .join(" ");

      const feats = (t.features || [])
        .map(
          (f) => `
          <li class="${f.on ? "" : "off"}">
            <span class="ico ${f.on ? "ico-on" : "ico-off"}">${f.on ? "✓" : "✕"}</span>
            <span>${escapeHtml(f.text)}</span>
          </li>`
        )
        .join("");

      return `
      <article class="${cls}" data-tier="${t.id}">
        ${t.badge ? `<span class="tier-badge">${escapeHtml(t.badge)}</span>` : ""}
        <div class="tier-icon">${t.icon || "◆"}</div>
        <h3 class="tier-name">${escapeHtml(t.name)}</h3>
        <p class="tier-desc">${escapeHtml(t.desc || "")}</p>
        <div class="tier-price">
          <span class="cur">¥</span>
          <span class="num">${t.price}</span>
        </div>
        <p class="tier-period">${escapeHtml(t.period || "一次性付费")}</p>
        <ul class="tier-features">${feats}</ul>
        <button class="btn ${t.highlight || t.supreme ? "btn-gold" : "btn-ghost"} btn-block"
                data-pay="${t.id}">立即赞助 ¥${t.price}</button>
      </article>`;
    })
    .join("");

  /* ---------------- 对比表 ---------------- */
  const compareTable = $("#compareTable");
  const rowNames = [];
  tiers.forEach((t) =>
    (t.features || []).forEach((f) => {
      if (!/^包含.*全部内容$/.test(f.text) && !rowNames.includes(f.text)) {
        rowNames.push(f.text);
      }
    })
  );

  const head = `
    <thead>
      <tr>
        <th>特权 / 套餐</th>
        ${tiers.map((t) => `<th>${escapeHtml(t.name)}</th>`).join("")}
      </tr>
    </thead>`;

  const priceRow = `
    <tr class="price-row">
      <td>价格</td>
      ${tiers.map((t) => `<td>¥${t.price}</td>`).join("")}
    </tr>`;

  const bodyRows = rowNames
    .map((name) => {
      const cells = tiers
        .map((t) => {
          const f = (t.features || []).find((x) => x.text === name);
          if (!f) return `<td class="no">—</td>`;
          return f.on
            ? `<td class="yes">✓</td>`
            : `<td class="no">✕</td>`;
        })
        .join("");
      return `<tr><td class="rowname">${escapeHtml(name)}</td>${cells}</tr>`;
    })
    .join("");

  compareTable.innerHTML = `${head}<tbody>${priceRow}${bodyRows}</tbody>`;

  /* ---------------- 流程 ---------------- */
  const stepsList = $("#stepsList");
  stepsList.innerHTML = (D.steps || [])
    .map(
      (s) =>
        `<li class="reveal"><h4>${escapeHtml(s.t)}</h4><p>${escapeHtml(s.d)}</p></li>`
    )
    .join("");

  /* ---------------- FAQ ---------------- */
  const faqList = $("#faqList");
  faqList.innerHTML = (D.faq || [])
    .map(
      (f, i) => `
      <div class="faq-item reveal">
        <button class="faq-q" data-faq="${i}" aria-expanded="false">${escapeHtml(f.q)}</button>
        <div class="faq-a"><p>${escapeHtml(f.a)}</p></div>
      </div>`
    )
    .join("");

  faqList.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq-q");
    if (!btn) return;
    const item = btn.parentElement;
    const ans = item.querySelector(".faq-a");
    const open = item.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0px";
  });

  /* ---------------- 赞助者名单 ---------------- */
  const sponsors = Array.isArray(D.sponsors) ? D.sponsors : [];
  if (sponsors.length) {
    const sec = $("#sponsors");
    sec.hidden = false;
    $("#sponsorList").innerHTML = sponsors
      .map(
        (s) => `
        <div class="sponsor reveal">
          <span class="sponsor-name">${escapeHtml(s.name || "匿名玩家")}</span>
          ${s.tier ? `<span class="sponsor-tier">${escapeHtml(s.tier)}</span>` : ""}
          ${s.note ? `<span class="sponsor-note">${escapeHtml(s.note)}</span>` : ""}
        </div>`
      )
      .join("");
  }

  /* ---------------- 页脚链接 ---------------- */
  const links = [];
  if (S.qqGroup)
    links.push(
      S.qqGroupLink
        ? `<a href="${S.qqGroupLink}" target="_blank" rel="noopener">QQ 群 ${escapeHtml(S.qqGroup)}</a>`
        : `<a href="#top">QQ 群 ${escapeHtml(S.qqGroup)}</a>`
    );
  if (S.javaIP) links.push(`<a href="#top">Java 版：${escapeHtml(S.javaIP)}</a>`);
  if (S.bedrockIP) links.push(`<a href="#top">基岩版：${escapeHtml(S.bedrockIP)}</a>`);
  if (S.adminContact) links.push(`<a href="#faq">联系管理：${escapeHtml(S.adminContact)}</a>`);
  $("#footerLinks").innerHTML = links.join("");

  /* ---------------- 支付弹窗 ---------------- */
  const modal = $("#payModal");
  const pay = D.pay || {};
  let lastFocus = null;

  function openPay(id) {
    const t = tiers.find((x) => x.id === id) || tiers[0];
    if (!t) return;
    lastFocus = document.activeElement;

    $("#payIcon").textContent = t.icon || "◆";
    $("#payTitle").textContent = t.name;
    $("#payPrice").textContent = `¥${t.price} ${t.unit || "元"}`;
    $("#payQrLabel").textContent = pay.qrLabel || "扫码赞助";
    $("#payMemo").textContent = `游戏ID + ${t.name}`;

    const img = $("#payQr");
    if (pay.qrImage) {
      img.src = pay.qrImage;
      img.style.display = "";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
    }

    $("#payTips").innerHTML = (pay.tips || [])
      .map((tip) => `<li>${escapeHtml(tip)}</li>`)
      .join("");

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal-close", modal).focus();
  }

  function closePay() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", (e) => {
    const payBtn = e.target.closest("[data-pay]");
    if (payBtn) {
      openPay(payBtn.dataset.pay);
      return;
    }
    if (e.target.closest("[data-close]")) closePay();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closePay();
  });

  /* 支持分享直达：#pay-pro / #pay-basic / #pay-supreme */
  const hash = location.hash.replace(/^#/, "");
  if (hash.startsWith("pay-")) {
    setTimeout(() => openPay(hash.slice(4)), 60);
  }
  window.addEventListener("hashchange", () => {
    const h = location.hash.replace(/^#/, "");
    if (h.startsWith("pay-")) openPay(h.slice(4));
  });

  /* 复制备注 */
  $("#copyMemo").addEventListener("click", async () => {
    const text = $("#payMemo").textContent;
    const btn = $("#copyMemo");
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const old = btn.textContent;
    btn.textContent = "已复制";
    setTimeout(() => (btn.textContent = old), 1400);
  });

  /* ---------------- 滚动相关 ---------------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* 进场动画 */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 55}ms`;
      io.observe(el);
    });
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------------- 工具 ---------------- */
  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
})();
