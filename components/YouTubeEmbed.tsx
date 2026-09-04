export default function YouTubeEmbed({
  videoId,
  title
}: {
  videoId: string;
  title: string;
}) {
  return (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-lg border border-line">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
