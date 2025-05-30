function getItemOnIndex(list, id) {
  return list.find(element => element.id === id);
}


const users = [
  { id: 1, username: "tawanda_m", password: "x8Jk2v9P" },
  { id: 2, username: "nomsa_k", password: "Qp7eR2bL" },
  { id: 3, username: "lunga23", password: "zK3mNp5x" },
  { id: 4, username: "musa_ncube", password: "vB1cW7yZ" },
  { id: 5, username: "chipo_moyo", password: "Yl2wE8rT" },
  { id: 6, username: "brian_k", password: "nT4dVs6Q" },
  { id: 7, username: "rufaro_p", password: "sG9aLm3W" },
  { id: 8, username: "thando_b", password: "Wp5qXr2L" },
  { id: 9, username: "takudzwa99", password: "eL7bMq1Z" },
  { id: 10, username: "mbali_s", password: "rK6xDw8N" }
];


module.exports = {
    getItemOnIndex,
    users
}