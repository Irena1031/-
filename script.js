const initialData = [
  {
    id: 1,
    title: "白色手機殼",
    type: "拾獲",
    category: "電子產品",
    location: "圖書館一樓櫃台",
    text: "白色手機殼，內含藍牙耳機，昨晚已暫存於櫃台，待失主認領。",
    time: "2026-10-06T19:00",
    status: "待領回",
    marker: "found"
  },
  {
    id: 2,
    title: "黑色雙肩書包",
    type: "失主",
    category: "其他",
    location: "工程館 302",
    text: "黑色雙肩書包，內有網路課程筆記與資料夾，外側有白色貼紙。",
    time: "2026-10-06T15:30",
    status: "尋找中",
    marker: "lost"
  },
  {
    id: 3,
    title: "學生證",
    type: "拾獲",
    category: "證件卡片",
    location: "學生餐廳二樓",
    text: "校名學生證，持有人名字為陳雅婷，請盡快聯絡櫃台。",
    time: "2026-10-07T12:10",
    status: "待確認",
    marker: "found"
  },
  {
    id: 4,
    title: "深藍色水壺",
    type: "失主",
    category: "其他",
    location: "行政大樓前廣場",
    text: "深藍色保溫杯，無任何標籤，下午在教學大樓前遺失。",
    time: "2026-10-07T08:45",
    status: "已通知",
    marker: "lost"
  }
];

const data = [...initialData];

const feedRoot = document.getElementById("itemFeed");
const detailTitle = document.getElementById("detailTitle");
const detailType = document.getElementById("detailType");
const detailStatus = document.getElementById("detailStatus");
const detailText = document.getElementById("detailText");
const detailList = document.getElementById("detailList");

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleString("zh-TW", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderFeed() {
  feedRoot.innerHTML = "";

  data.forEach((item) => {
    const article = document.createElement("article");
    article.className = "feed-item";

    const tagClass = item.type === "拾獲" ? "found" : "lost";

    article.innerHTML = `
      <div class="feed-header">
        <span class="feed-tag ${tagClass}">${item.type}</span>
        <span>${item.category}</span>
      </div>
      <h4>${item.title}</h4>
      <p>${item.text}</p>
      <p><strong>地點：</strong> ${item.location}</p>
      <p><strong>時間：</strong> ${formatDate(item.time)}</p>
    `;

    article.addEventListener("click", () => updateMapDetail(item));
    feedRoot.appendChild(article);
  });
}

function updateMapDetail(item) {
  detailTitle.textContent = item.location;
  detailType.textContent = item.type;
  detailStatus.textContent = item.status;
  detailText.textContent = item.text;
  detailList.innerHTML = `
    <li>物品：${item.title}</li>
    <li>時間：${formatDate(item.time)}</li>
    <li>地點：${item.location}</li>
  `;
}

function bindMarkerEvents() {
  document.querySelectorAll(".marker").forEach((button) => {
    const item = data.find((entry) => Number(entry.id) === Number(button.dataset.id));
    if (!item) return;

    button.addEventListener("click", () => updateMapDetail(item));
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  const record = {
    id: Date.now(),
    title: formData.get("itemName"),
    type: form.dataset.mode === "found" ? "拾獲" : "失主",
    category: formData.get("category"),
    location: formData.get("location"),
    text: formData.get("description") || "已通報請等待校方協助核對。",
    time: formData.get("time"),
    status: form.dataset.mode === "found" ? "待領回" : "尋找中",
    marker: form.dataset.mode === "found" ? "found" : "lost"
  };

  data.unshift(record);
  renderFeed();
  updateMapDetail(record);
  form.reset();
}

const foundForm = document.getElementById("foundForm");
foundForm.dataset.mode = "found";
foundForm.addEventListener("submit", handleFormSubmit);

const lostForm = document.getElementById("lostForm");
lostForm.dataset.mode = "lost";
lostForm.addEventListener("submit", handleFormSubmit);

renderFeed();
updateMapDetail(data[0]);
bindMarkerEvents();
