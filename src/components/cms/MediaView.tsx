import { DefaultTemplate } from "@payloadcms/next/templates";
import type { AdminViewServerProps } from "payload";
import { redirect } from "next/navigation";
import { MediaExplorer } from "./MediaExplorer";

export function MediaView(props: AdminViewServerProps) {
  const { req, visibleEntities } = props.initPageResult;
  if (!req.user) redirect("/admin/login?redirect=%2Fadmin%2Fmedia");
  return (
    <DefaultTemplate {...props} req={req} visibleEntities={visibleEntities}>
      <MediaExplorer />
    </DefaultTemplate>
  );
}
