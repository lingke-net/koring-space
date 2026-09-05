import pkg from "../package.json";

/**
 * 站点自身构建信息（仅服务端使用）
 *
 * - SITE_VERSION     版本号：读取 package.json
 * - SITE_BUILD_ISO   编译时间：模块首次求值时刻（静态页在 next build 预渲染时烘焙冻结；
 *                    dev 模式下为每次服务启动/重载时刻，属预期行为）
 */
export const SITE_VERSION: string = pkg.version || "0.0.0";

export const SITE_BUILD_ISO: string = new Date().toISOString();

/** 编译时间展示文案（固定 Asia/Shanghai，与服务端时区无关） */
export const SITE_BUILD_LABEL: string = (() => {
  try {
    const d = new Date(SITE_BUILD_ISO);
    const fmt = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = fmt.formatToParts(d);
    const get = (type: string) =>
      parts.find((x) => x.type === type)?.value || "";
    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
      "minute"
    )}`;
  } catch {
    // 兜底：本地时间
    const d = new Date(SITE_BUILD_ISO);
    const p2 = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(
      d.getHours()
    )}:${p2(d.getMinutes())}`;
  }
})();
