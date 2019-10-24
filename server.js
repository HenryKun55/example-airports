const axios = require("axios");
const fs = require("fs");

const loop = async init => {
  let temp = init;
  let airports = [];
  while (true) {
    temp = generate(temp);
    if (temp == init) break;
    try {
      const response = await axios.get(
        `https://www.decolar.com/suggestions?locale=pt-BR&profile=sbox-cp-vh&hint=${temp}&fields=city`
      );
      const data = response.data;
      if (data.items.length == 1) {
        for (let i = 0; i < data.items[0].items.length; i++) {
          const airport = data.items[0].items[i];
          airports.push(airport);
          console.log(airport);
        }
      }
      if (data.items.length == 2) {
        for (let i = 0; i < data.items[1].items.length; i++) {
          const airport = data.items[1].items[i];
          airports.push(airport);
          console.log(airport);
        }
      }
    } catch (err) {
      console.log(err);
      console.log("ocorreu um erro");
    }
  }
  const csv = arrayToCSV(airports);

  fs.writeFile(__dirname+"/airports.csv", csv, "utf8", 
    function(err) {
      if (err) {
        console.log("Some error occured - file either not saved or corrupted file saved.");
    } else {
      console.log("It's saved!");
    }
  });
};
function generate(str) {
  let alphabet = "abcde".split(""); //fghijklmnopqrstuvwxyz
  let chars = [];
  for (let i = 0; i < str.length; i++) {
    chars.push(alphabet.indexOf(str[i]));
  }
  for (let i = chars.length - 1; i >= 0; i--) {
    let tmp = chars[i];
    if (tmp >= 0 && tmp < 4) {
      chars[i]++;
      break;
    } else {
      chars[i] = 0;
    }
  }
  let newstr = "";
  for (let i = 0; i < chars.length; i++) {
    newstr += alphabet[chars[i]];
  }
  return newstr;
}

function arrayToCSV(objArray) {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  let str =
    `${Object.keys(array[0])
      .map(value => `"${value}"`)
      .join(",")}` + "\r\n";

  return array.reduce((str, next) => {
    delete next.highlight;
    str +=
      `${Object.values(next)
        .map(value => {
          return typeof value === "object"
            ? `"${JSON.stringify(value).replace(/"/g, "'")}"`
            : `"${value}"`;
        })
        .join(",")}` + "\r\n";
    return str;
  }, str);
}

loop("aaa");
