export const formatDate = (dateString) => {
  const shortDate = dateString.split(".")[0];
  const dateAndHour = shortDate.split("T");
  const hour = dateAndHour[1];
  const _date = dateAndHour[0].split("-").reverse().join("/");
  return `Le ${_date} à ${hour}`;
};

// 2022-03-20T14:00:50.000Z
