import { ChildProcess, spawn } from "child_process";
import { closeSync, openSync } from "fs";
import rateLimit from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

//set DEPLOY_SCRIPT and DEPLOY_TOKEN in .env
//DEPLOY_TOKEN is optional and corresponds to gitlab's X-Gitlab-Token header

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds - adjust to approximate deployment time
  uniqueTokenPerInterval: 1, // Max users per second
});
var child = null as ChildProcess | null; //prevents multiple deployment scripts from running concurrently

export async function GET(_req: NextRequest, res: NextResponse) {
  try {
    const headers = await limiter.check(res, 2, "CACHE_TOKEN"); // 1 request within interval (not sure why the option is n-1)
    const [names, values] = Object.entries(headers).reduce(
      (acc, [key, val]) => {
        return [acc[0].concat(key), acc[1].concat(val)];
      },
      [[] as string[], [] as any[]],
    );

    if (
      !process.env.DEPLOY_TOKEN ||
      process.env.DEPLOY_TOKEN == _req.headers.get("x-gitlab-token") //"x-hub-signature-256" for github
    ) {
      if (!child) {
        console.log("Starting deployment");
        const logPipe = openSync(String("last_deploy.log"), "w"); //perhaps redundant with pm2 logs
        child = spawn(String(process.env.DEPLOY_SCRIPT), [], {
          shell: true, //windows compatibility
          //detached: true,  //not needed with pm2 using the --no-treekill flag
          stdio: [logPipe, logPipe, logPipe],
        });
        child?.stdout?.setEncoding("utf8");
        child?.stdout?.on("data", function (data) {
          console.log(data); //logs to pm2
        });
        child.on("close", function () {
          console.log("Deploy script finished");
          closeSync(logPipe);
          child = null;
        });
      } else {
        console.error("A deployment is already running!");
        const response = NextResponse.json(
          { error: "A deployment is already running!" },
          { status: 429 },
        );

        for (let i = 0; i < names.length; i++) {
          response.headers.append(names[i], values[i]);
        }

        return response;
      }
    } else {
      console.error("Invalid deployment token!");
      const response = NextResponse.json(
        { error: "Invalid deployment token!" },
        { status: 403 },
      );

      for (let i = 0; i < names.length; i++) {
        response.headers.append(names[i], values[i]);
      }
      return response;
    }

    const response = NextResponse.json({ deploying: true }, { status: 200 });

    for (let i = 0; i < names.length; i++) {
      response.headers.append(names[i], values[i]);
    }
    return response;
  } catch {
    console.error("Rate limit exceeded");

    const response = NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 },
    );

    return response;
  }
}
