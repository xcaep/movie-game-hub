export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const query = url.searchParams.get("query") || "";
    const page = url.searchParams.get("page") || "1";

    if (!query.trim()) {
        return Response.json({
            results: [],
            total_pages: 0
        });
    }

    const tmdbUrl =
        `https://api.themoviedb.org/3/search/movie` +
        `?api_key=${encodeURIComponent(context.env.TMDB_API_KEY)}` +
        `&query=${encodeURIComponent(query)}` +
        `&page=${encodeURIComponent(page)}` +
        `&include_adult=false`;

    try {
        const response = await fetch(tmdbUrl);

        if (!response.ok) {
            return Response.json(
                { error: "TMDB request failed" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return Response.json(data, {
            headers: {
                "Cache-Control": "public, max-age=300"
            }
        });

    } catch (error) {
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
