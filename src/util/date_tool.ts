

export class DateTool {

static newDate():string{
   return this.formatDate(new Date)
}

 /**
     * 格式化日期
     * @param date 日期
     * @param fmt 格式化字符串
     * @returns 字符串
     */
 static formatDate(date: Date) {
    
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    
    return (
        [year, month, day].map(formatNumber).join('-') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
      )
}

}

const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
  }