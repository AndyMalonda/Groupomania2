// 2022-03-20T14:00:50.000Z
export const formatDate = (dateString) => {
  const shortDate = dateString.split(".")[0];
  const dateAndHour = shortDate.split("T");
  const hour = dateAndHour[1].split(":")[0];
  const minutes = dateAndHour[1].split(":")[1];
  const _date = dateAndHour[0].split("-").reverse().join("/");
  return `Le ${_date} à ${hour}:${minutes}`;
};

// export const formatDate = (dateString) => {
//   const dateAndHour = dateString.split(" ");
//   const hour = dateAndHour[1].split(":")[0];
//   const minutes = dateAndHour[1].split(":")[1];
//   const _date = dateAndHour[0].split("-").reverse().join("/");
//   return `Le ${_date} à ${hour}:${minutes}`;
// };

// calculate the hours between two dates
export const getHoursSincePost = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;
  const diffHours = Math.floor(diff / 3600000);
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diff / 60000);
    if (diffMinutes < 1) {
      return "Il y a moins d'une minute";
    } else if (diffMinutes === 1) {
      return `Il y a 1 minute`;
    } else if (diffMinutes < 60) {
      return `Il y a ${Math.floor(diffMinutes)} minutes`;
    } else {
      return formatDate(date);
    }
  } else if (diffHours === 1) {
    return `Il y a 1 heure`;
  } else if (diffHours < 24) {
    return `Il y a ${Math.floor(diffHours)} heures`;
  } else {
    return formatDate(date);
  }
};

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
