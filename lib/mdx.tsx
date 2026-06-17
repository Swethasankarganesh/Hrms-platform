import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const options: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
};

export async function PolicyMdx({ source }: { source: string }) {
  return (
    <div className="prose-policy">
      <MDXRemote
        source={source}
        options={options}
        onError={({ error }) => (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Could not render this policy: {error.message}
          </p>
        )}
      />
    </div>
  );
}
