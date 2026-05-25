import { GetStaticProps } from "next";
import { collectedNotes, Site } from "collected-notes";
import { SearchPageProps } from "types";
import { SearchLayout } from "layouts/search";

const PLACEHOLDER_SITE: Site = {
  id: 0,
  user_id: 0,
  name: "Collected Notes",
  headline: "Configure CN_EMAIL, CN_TOKEN, and CN_SITE_PATH to enable search.",
  about: "",
  host: null,
  site_path: "",
  created_at: "",
  updated_at: "",
  payment_platform: null,
  is_premium: false,
  total_notes: 0,
} as unknown as Site;

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
  if (
    !process.env.CN_EMAIL ||
    !process.env.CN_TOKEN ||
    !process.env.CN_SITE_PATH
  ) {
    return { props: { site: PLACEHOLDER_SITE } };
  }

  const cn = collectedNotes(process.env.CN_EMAIL, process.env.CN_TOKEN);
  const { site } = await cn.site(process.env.CN_SITE_PATH, 1, "public_site");
  return { props: { site } };
};

export default SearchLayout;
