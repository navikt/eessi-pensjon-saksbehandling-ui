import * as constants from '../constants/constants'

export function getAttachmentContentMd5Signatures (attachments) {
  return attachments ? Object.keys(attachments) : []
}

export function getPeriodAttachmentMd5Signatures (stayAbroad) {
  return getUsedAttachments(stayAbroad).map(file => file.content.md5)
}

export function getUsedAttachments (stayAbroad) {
  let attachments = []
  stayAbroad.forEach(period => {
    if (!period.attachments) { return }
    attachments = attachments.concat(period.attachments)
  })
  return attachments
}

// ['foo.json', 'bar.json', 'baz.json'] => ['foo', 'bar', 'baz']
export function getMd5SignatureFromFileList (fileList) {
  if (!fileList) {
    return []
  }
  const fileAttachments = fileList.filter(file => { return file !== constants.PINFO_FILE })
  const fileMd5Signatures = fileAttachments.map(file => { return file.split('.')[0] })

  return fileMd5Signatures
}
