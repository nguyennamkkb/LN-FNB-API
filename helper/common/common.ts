import { writeLogToFile } from "./logger";

var md5 = require("md5");
export class Common {
  static keyApp: string = process.env.KEY_APP;
  static AppName: String = process.env.APP_NAME;

  static removeAccents(str: string): string {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ",
      "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ",
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
  static checkRequest(timeRequest: number, cks: string): boolean {
    const now = Date.now();

    if (now - timeRequest > 10000) {
      return false;
    }
    const cksCalculate: string = this.MD5Hash(this.keyApp + timeRequest);

    if (cksCalculate != cks) {
      return false;
    }
    return true;
  }
  static MD5Hash(s: string): string {
    return md5(s);
  }
  static makeRandomStringWithLength(length: number): string {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  static getCurrentTime(): string {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = String(currentDate.getFullYear());
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  static getFileLogName(): string {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = String(currentDate.getFullYear());

    return `${year}-${month}-${day}`;
  }

  static async verifyRequest(
    cksRequest: String,
    timeRequest: number
  ): Promise<boolean> {
    try {
      const key_app =  process.env.KEY_APP
      const dataCks = key_app + timeRequest;
      const cksApp = this.MD5Hash(dataCks);
      // writeLogToFile(
      //   `verifyRequest cksRequest:${cksRequest.substring(
      //     0,
      //     32
      //   )}, cksApp:${cksApp}, keyapp:${this.keyApp}, timeRequest:${timeRequest}`
      // );
 
      if (cksApp == cksRequest) {

        return true;
      } else {

        return false;
      }
      return true
    } catch (error) {
      
      writeLogToFile(`verifyRequest catch ${error}`);
      return false;
    }
  }

  static async getIdShop(s: string): Promise<Number> {
    // id phia sau ma cks
    return Number(s.substring(32, s.length));
  }

  static async formatDateFromMilliseconds(
    milliseconds: string
  ): Promise<string> {
    try {
      const date = new Date(Number(milliseconds));
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "";
    }
  }
  static async calculateTotalAmountByDay(data: any[]): Promise<any> {
    const result = {};

    data.forEach((entry: { date: any; money: any }) => {
      const { date, money } = entry;
      if (!result[date]) {
        result[date] = {
          totalMoney: 0,
          recordsCount: 0,
        };
      }
      result[date].totalMoney += money;
      result[date].recordsCount++;
    });

    const totalAmountByDay = Object.keys(result).map((date) => {
      const { totalMoney, recordsCount } = result[date];
      return { date, money: totalMoney, recordsCount };
    });

    return totalAmountByDay;
  }
  static async generateRandomNumberString(length: number): Promise<string> {
    let result = "";
    const characters = "0123456789";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  static async getHour(milliseconds: string) {
    try {
      const date = new Date(Number(milliseconds));
      const hour = String(date.getHours()).padStart(2, "0");
      return hour;
    } catch (error) {
      return "";
    }
  }
}
