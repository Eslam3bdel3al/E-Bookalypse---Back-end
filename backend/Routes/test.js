string = "2022-08-27T22:00:00.000Z";

let year = string.split("T")[0].split("-")[0];

let month = string.split("T")[0].split("-")[1];

let day = string.split("T")[0].split("-")[2];

const endDate = new Date(`${month}/${month}/${year}`)