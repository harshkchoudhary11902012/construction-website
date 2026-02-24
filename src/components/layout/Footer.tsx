import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export async function Footer() {
	const client = createClient();
	const footer = await client.getSingle("footer").catch(() => null);

	if (!footer?.data?.slices?.length) {
		return null;
	}

	return (
		<SliceZone slices={footer.data.slices} components={components} />
	);
}
