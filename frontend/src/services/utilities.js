export const formatDate = (dateString) => {
  const shortDate = dateString.split(".")[0];
  const dateAndHour = shortDate.split("T");
  const hour = dateAndHour[1].split(":")[0];
  const minutes = dateAndHour[1].split(":")[1];
  const _date = dateAndHour[0].split("-").reverse().join("/");
  return `Le ${_date} à ${hour}:${minutes}`;
};

// 2022-03-20T14:00:50.000Z

export const getInitialsFromName = (nameString) => {
  if (nameString.split(" ").length > 1) {
    return getInitials(nameString);
  } else {
    return nameString.charAt(0);
  }
};

export const getInitials = (nameString) => {
  const firstNameLetter = nameString.split(" ")[0].charAt(0);
  const lastNameLetter = nameString.split(" ")[1].charAt(0);
  const initials = firstNameLetter + lastNameLetter;
  return initials;
};

export const getLastCharacter = (string) => {
  return string.charAt(string.length - 1);
};
