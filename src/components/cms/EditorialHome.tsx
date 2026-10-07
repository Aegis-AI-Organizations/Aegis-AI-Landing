import { redirect } from "next/navigation";

// The article index is the workspace: no intermediate dashboard.
export function EditorialHome() {
  redirect("/admin/collections/posts");
}
