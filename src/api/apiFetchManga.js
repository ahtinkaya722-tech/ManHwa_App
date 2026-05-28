export const fetchMangaByGenre = async (genreId, limit = 12) => {
  try {
    const url = new URL("https://api.mangadex.org/manga");

    url.searchParams.append("limit", String(limit));
    url.searchParams.append("includes[]", "cover_art");
    url.searchParams.append("includedTags[]", genreId);
    url.searchParams.append("order[followedCount]", "desc");

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return data?.data || [];
  } catch (error) {
    console.log("fetchMangaByGenre error:", error);
    return [];
  }
};
