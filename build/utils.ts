import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function isDevFn(mode: string): boolean {
  return mode === "development";
}

export function isProdFn(mode: string): boolean {
  return mode === "production";
}

/**
 * @description 确定是否生成软件包预览
 */
export function isReportMode(): boolean {
  return process.env.REPORT === "true";
}

/**
 * @description 读取所有环境变量配置文件到 process.env
 * @param envConf
 */
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName =
      realName === "true" ? true : realName === "false" ? false : realName;

    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    // if (envName === "VITE_PROXY") {
    //   //类数组字符串转数组
    //   realName = realName.replace(/[\[\]]/g, "").split(",");
    // }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}

/**
 * @description 获取配置文件名
 * @param match
 * @param confFiles
 */
export function getEnvConfig(
  match = "VITE_GLOB_",
  confFiles = [".env", ".env.production"]
) {
  let envConfig = {};
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(
        fs.readFileSync(path.resolve(process.cwd(), item))
      );
      envConfig = { ...envConfig, ...env };
    } catch (error) {}
  });

  Object.keys(envConfig).forEach((key) => {
    const reg = new RegExp(`^(${match})`);
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}

/**
 * @description 获取根目录路径
 * @param dir 目录
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}

/**
 * 对象转二维数组
 */
export function objectToTree(obj: Record<string, string>) {
  return Object.entries(obj).map(([key, value]) => [key, value]);
}
