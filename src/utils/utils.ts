export const formatDate = (dateString: String | undefined) => {
  if(dateString) {
    const dateParts = dateString.split("-")
    return dateParts[2] + "." + dateParts[1] + "." + dateParts[0]
  } else {
    return dateString
  }
}

export const removeWhiteSpace = (str: String)=> {
  return str.split(' ').join('');
}

export const replaceCommasWithPeriods = (str: String)=> {
  return str.split(',').join('.');
}

export const replacePeriodsWithCommas = (str: String | undefined)=> {
  if(str) {
    return str.split('.').join(',');
  }
  else {
    return str
  }
}

export const removeWhiteSpaceAndReplaceCommas = (str: String)=> {
  return replaceCommasWithPeriods(removeWhiteSpace(str))
}
