import { notFound } from "next/navigation";
import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";
type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};
export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config, params, searchParams });
export default async function Page({ params, searchParams }: Args) {
  if (
    process.env.NODE_ENV === "production" &&
    (await params).segments?.[0] === "create-first-user"
  )
    notFound();
  return RootPage({ config, params, searchParams, importMap });
}
