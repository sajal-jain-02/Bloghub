const featuredArticles = [
  {
    id: '1',
    title: 'Building a Full-Stack Blog with Express and MongoDB',
    excerpt:
      'From schema design and indexing in Mongoose to robust JWT session handling and paginated API endpoints, here is a complete architectural blueprint for a modern publishing engine.',
    author: 'Mark Henry',
    date: 'Nov 09, 2026',
    readTime: '8 min read',
  },
  {
    id: '2',
    title: 'Automating WhatsApp Bookings with n8n and WhatsApp Cloud API',
    excerpt:
      'How to orchestrate webhooks, parse inbound customer payloads, and automate real-time slot scheduling without writing complex middleware boilerplate.',
    author: 'Elena Rostova',
    date: 'Nov 06, 2026',
    readTime: '6 min read',
  },
  {
    id: '3',
    title: 'Mastering Neumorphism & Glass UI in CSS',
    excerpt:
      'Exploring hardware-accelerated backdrops, layered specular highlights, and ambient light sources to design tactile, futuristic interfaces that remain fully accessible.',
    author: 'Marcus Chen',
    date: 'Nov 03, 2026',
    readTime: '5 min read',
  },
]

export default function FeaturedPosts() {
  return (
    <section id="featured" className="w-full bg-obsidian py-16 md:py-20 px-6 border-b border-chrome/10 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Crimson-to-Transparent Gradient Line */}
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-chrome-bright whitespace-nowrap">
            Editor's Picks
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-crimson via-crimson/40 to-transparent" />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredArticles.map((article) => (
            <article
              key={article.id}
              className="group cursor-pointer flex flex-col h-full gap-4 p-6 rounded-2xl border border-chrome/10 bg-[#121316]/70 hover:bg-[#18191e]/90 hover:border-crimson/30 hover:shadow-2xl hover:shadow-crimson/10 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Meta Top */}
              <div className="text-xs text-chrome/70 font-mono">
                {article.date} · {article.readTime}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-serif font-bold text-chrome-bright leading-snug transition-colors group-hover:text-crimson">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-chrome/70 text-sm leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              {/* Bottom Footer with Author and Interactive Arrow Link */}
              <div className="mt-auto pt-4 border-t border-chrome/10 flex items-center justify-between text-sm">
                <span className="font-medium text-chrome">{article.author}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-chrome/70 group-hover:text-crimson transition-colors duration-200">
                  Read Article
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                    ➝
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
