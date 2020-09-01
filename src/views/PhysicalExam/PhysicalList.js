const basicLabel = ["檢查日期", "檢查醫院", "姓名", "身分證號", "出生日期", "聯絡電話", "行動電話", "本人電話", "家屬(父母)", "戶籍地址"];
const basicMeasuremnt = ["身高", "體重", "體格指標值(BMI)", "血壓", "脈博"];
const checkItem = [
  // { key: "abnormal", label: "異常" },
  // { key: "normal", label: "正常" },
  { key: "status", label: "狀態" },
  { key: "ckeckItem", label: "檢查項目" },
];
const checkList = [
  { status: true, ckeckItem: "牙科檢查" },
  { status: false, ckeckItem: "頭部顏面頸頭皮" },
  { status: false, ckeckItem: "皮膚及淋巴腺" },
  { status: false, ckeckItem: "鼻" },
  { status: false, ckeckItem: "竇" },
  { status: false, ckeckItem: "口腔" },
  { status: false, ckeckItem: "咽喉" },
  { status: false, ckeckItem: "肺部及胸部" },
  { status: false, ckeckItem: "胸部X光" },
  { status: false, ckeckItem: "腹部" },
  { status: false, ckeckItem: "心臟" },
  { status: false, ckeckItem: "內分泌腺" },
  { status: false, ckeckItem: "血管( 曲 張 )" },
  { status: false, ckeckItem: "肛門及直腸" },
  { status: false, ckeckItem: "生殖器" },
  { status: false, ckeckItem: "上肢及關節" },
  { status: false, ckeckItem: "下肢及關節" },
  { status: false, ckeckItem: "耳器" },
  { status: false, ckeckItem: "鼓膜" },
  { status: false, ckeckItem: "聽力" },
  { status: false, ckeckItem: "眼" },
  { status: false, ckeckItem: "眼底" },
  { status: false, ckeckItem: "辦色力" },
  { status: false, ckeckItem: "視力" },
  { status: false, ckeckItem: "神經系統" },
  { status: false, ckeckItem: "精神" },
  { status: false, ckeckItem: "智力" },
  { status: false, ckeckItem: "心電圖" },
];
export { basicLabel, basicMeasuremnt, checkItem, checkList };
