import { redirect } from "next/navigation";

/** /download old path compat: redirect to /launcher/download */
export default function OldDownloadRedirect() {
  redirect("/launcher/download");
}
