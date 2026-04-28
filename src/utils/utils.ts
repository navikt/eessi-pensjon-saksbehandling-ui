import {JoarkBrowserItems} from "src/declarations/joark";

export const sumFilstoerrelseMb = (items: JoarkBrowserItems) : number => {
  let filstoerrelseSum = 0

  items.map(item => {
    filstoerrelseSum += item.filstoerrelseMb ?? 0
  })

  return filstoerrelseSum
}

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
