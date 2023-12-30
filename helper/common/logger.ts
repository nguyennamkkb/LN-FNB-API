import * as fs from 'fs';
import * as path from 'path';
import { Common } from './common';

export  function writeLogToFile(log: string){
    //   const logFilePath = path.join(__dirname, 'logs', 'app.log');
    try {
        const timeNow: String = Common.getCurrentTime()
        const fileLogName: String = timeNow.substring(0,10)
        const logFilePath = `log/${fileLogName}.txt`;
    
        // Create the logs directory if it doesn't exist
        if (!fs.existsSync(path.dirname(logFilePath))) {
            fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
        }
    
        // Append the log to the file
    
        const headLog = timeNow + " " + Common.AppName + ": "
         fs.appendFileSync(logFilePath, headLog + log + '\n');
    } catch (error) {
        
    }
   
}
