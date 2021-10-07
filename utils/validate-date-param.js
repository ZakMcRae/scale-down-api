// check to see if url parameter date is in format YYYY-MM-DD
// decent but not complete check - doesn't account for specific months max day, leap years
function isValidParamDate(date) {
  try {
    const dateSplit = date.split("-");
    if (
      !(dateSplit[0].length === 4 && dateSplit[0] < 3000 && dateSplit[0] > 2000)
    ) {
      return false;
    }
    if (dateSplit[1] > 13 || dateSplit[1] < 1) {
      return false;
    }
    if (dateSplit[2] > 31 || dateSplit[2] < 1) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

module.exports = isValidParamDate;
