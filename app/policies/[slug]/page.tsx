import { readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PolicyMdx } from "@/lib/mdx";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = await readPolicy(slug);

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <Link className="text-sm font-semibold text-coral" href="/">
        ← Back to PeopleFlow
      </Link>
      <p className="eyebrow mt-10">Company policy</p>
      <h1 className="text-4xl font-bold tracking-tight">
        {String(policy.data.title)}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Last updated {String(policy.data.updated)}
      </p>
      <div className="mt-10">
        <PolicyMdx source={policy.content} />
      </div>
    </main>
  );
}

async function readPolicy(slug: string) {
  try {
    const file = await readFile(
      join(process.cwd(), "content", "policies", `${slug}.mdx`),
      "utf8",
    );
    return matter(file);
  } catch {
    notFound();
  }
}
