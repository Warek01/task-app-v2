import express = require("express");
import chalk = require("chalk");
import fs = require("fs");
import bodyParser = require("body-parser");
import cors = require("cors");
import path = require("path");
import ejs = require("ejs");

const app = express();

let tasks: any = JSON.parse(fs.readFileSync(path.join(__dirname, "tasks.json")).toString());

nodeArgs();
app.use(cors());
app.set("view engine", "ejs");

app.route("/").get((req, res, next): void => {
   res.render(path.join(__dirname, "views", "index.ejs"), {tasks: tasks});
}).post(express.json({strict: true}), express.urlencoded({extended: true}), (req, res, next): void => {
   try {
      // Get request body (task)
      let body: {content: string, timestamp: string} = req.body;
      // Push gotten task to local memory tasks array
      tasks.tasks.push(body);
      // Overwrite static memory file with local memory tasks array
      fs.writeFileSync(path.join(__dirname, "tasks.json"), JSON.stringify(tasks, null, 2));

   } catch(error) {
      console.log(error);
      res.end("Error");
      return;
   }
   res.end("Success");
}).delete((req, res, next) => {
   try {
      let index: number = Number(req.query.index);
      // Remove item from array
      tasks.tasks.splice(index, 1);
      // Overwrite static memory file with local memory tasks array
      fs.writeFileSync(path.join(__dirname, "tasks.json"), JSON.stringify(tasks, null, 2));
   } catch(error) {
      console.log(error);
      res.end("Error");
      return;
   }
   res.end("Success");
});

app.listen(nodeArgs().port, nodeArgs().port_log);

// Console logger
function log(req: any, res: any, next: any): void {
   console.log(chalk.hex("#74b9ff")("Request got for "), chalk.hex("#A3CB38")(req.url));
   next();
}

/**
 * Watches for params: "node [file_name] [params...]"                          
 * -d or --debug for Debugging mode                                  
 * -p [port] or --port [port] to set port                
 * -l or --log to trigger Console logger                 
 * @returns Current listened port and port logging function
 * @params none
 * 
 */
function nodeArgs(): {port: string, port_log(): void} {
   const argv = require("optimist").argv;
   // -d or --debug
   if (argv.d || argv.debug) {
      argv.log = true;
      argv.port = 8000;
   }

   // -l or --log
   if (argv.l || argv.log)
      app.use(log);

   // -p [port] or --port [port]
   return {
      port: argv.port || argv.p? argv.port || argv.p : 8000,
      /** Logs in console current listened port
       * @returns Nothing
       */
      port_log(): void {
         console.log('"' + path.parse(__filename).base + '"' + " is listening to port " + chalk.hex("#ED4C67")(argv.port || argv.p? argv.port || argv.p : 8000));
      }
   };
}

app.use(express.static(path.resolve(__dirname, "../")));
