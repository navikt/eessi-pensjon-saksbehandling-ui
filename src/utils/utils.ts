import {JoarkBrowserItems} from "src/declarations/joark";

export const sumFilstoerrelseMB = (items: JoarkBrowserItems) : number => {
  let filstoerrelseSum = 0

  items.map(item => {
    filstoerrelseSum += item.filstoerrelseMB ?? 0
  })

  return filstoerrelseSum
}

export const checkSumFilstoerrelseMB = (sumFilstoerrelseMB: number, attachmentsSize: string | null | undefined, sumFilstoerrelseLimit: number) : boolean => {
  const existingSize = parseFloat(attachmentsSize ?? '0') || 0
  return (existingSize + sumFilstoerrelseMB) < sumFilstoerrelseLimit;
}

export const checkSingleFilstoerrelseMB = (items: JoarkBrowserItems, singleFilstoerrelseLimit: number) : boolean => {
  for (const item of items) {
    if (item.filstoerrelseMB && item.filstoerrelseMB >= singleFilstoerrelseLimit) {
      return false;
    }
  }
  return true;
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
