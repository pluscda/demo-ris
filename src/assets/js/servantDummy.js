const dummyData = [
  {
    name: "簡又新",
    id: "A000999876",
    birthday: "87/09/05",
    telPhone: "02-2231-3366",
    phone: "0975-689-000",
    addr: "臺北市萬華區",
    date: null,
    hospital: "臺大醫院",
    type: "常備役",
  },
  {
    name: "楊嘉瑋",
    id: "F268445327",
    birthday: "86/12/05",
    telPhone: "02-2866-1266",
    phone: "0975-699-123",
    addr: "臺北市中正區",
    date: null,
    hospital: "臺大醫院",
    type: "常備役",
  },
  {
    name: "吳小新",
    id: "O998300898",
    birthday: "86/12/05",
    telPhone: "02-2882-6688",
    phone: "0935-999-064",
    addr: "臺北市士林區",
    date: null,
    hospital: "馬偕醫院",
    type: "常備役",
  },
  {
    name: "丁國士",
    id: "A887733332",
    birthday: "87/01/19",
    telPhone: "02-2342-8907",
    phone: "0935-000-06",
    addr: "臺北市中正區",
    date: null,
    hospital: "馬偕醫院",
    type: "常備役",
  },
  {
    name: "陳柏梵",
    id: "F990339900",
    birthday: "87/01/19",
    telPhone: "02-2238-0577",
    phone: "0975-099-0546",
    addr: "臺北市萬華區",
    date: null,
    hospital: "臺大醫院",
    type: "常備役",
  },
  {
    name: "陳俊男",
    id: "F990334213",
    birthday: "87/11/18",
    telPhone: "02-2239-0587",
    phone: "0976-125-1554",
    addr: "臺北市大安區",
    date: null,
    hospital: "長庚醫院",
    type: "常備役",
  },
];

export default (id = null) => {
  dummyData.forEach((item) => {
    const diff = Math.floor(Math.random() * 1000000000);
    item.date = new Date(new Date().getTime() - diff);
  });
  return id ? dummyData.find((item) => item.id === id) : dummyData;
};
