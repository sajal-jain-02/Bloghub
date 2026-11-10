const row1Blogs = [
  {
    title: 'Scaling FastAPI with Docker',
    author: 'Suzane Smith',
    readTime: '7 min',
    excerpt: 'A complete production-ready guide to containerizing your Python APIs for massive scale.',
  },
  {
    title: 'Automating Complex Workflows',
    author: 'Elena Rostova',
    readTime: '5 min',
    excerpt: 'Using n8n and Python scripts to eliminate manual data entry across enterprise systems.',
  },
  {
    title: 'Optimizing SQL Queries',
    author: 'Marcus Chen',
    readTime: '8 min',
    excerpt: 'Advanced indexing and caching strategies for high-traffic Node.js applications.',
  },
  {
    title: 'Building Clean REST APIs',
    author: 'David Kim',
    readTime: '6 min',
    excerpt: 'Structuring scalable Express.js backends with JWT authentication and middleware.',
  },
]

const row2Blogs = [
  {
    title: 'DOM Manipulation & Events',
    author: 'Anita Desai',
    readTime: '4 min',
    excerpt: 'Mastering Vanilla JavaScript custom event listeners without relying on heavy frameworks.',
  },
  {
    title: 'Microservices with Go',
    author: 'Sarah Jenkins',
    readTime: '9 min',
    excerpt: 'Designing lightweight, highly concurrent microservices using Go and gRPC.',
  },
  {
    title: 'The Art of Clean CSS',
    author: 'Smith Johnson',
    readTime: '5 min',
    excerpt: 'Crafting scalable glassmorphic UI components using Tailwind CSS and minimal markup.',
  },
  {
    title: 'Event-Driven Architecture',
    author: 'Alex Mercer',
    readTime: '7 min',
    excerpt: 'Decoupling monolithic Node.js apps using Redis Pub/Sub and message queues.',
  },
]

const duplicatedRow1 = [...row1Blogs, ...row1Blogs, ...row1Blogs, ...row1Blogs]
const duplicatedRow2 = [...row2Blogs, ...row2Blogs, ...row2Blogs, ...row2Blogs]

function BlogCard({ blog }) {
  return (
    <article className="w-[400px] shrink-0 p-6 rounded-2xl border border-white/30 bg-white/45 backdrop-blur-md cursor-pointer group hover:-translate-y-1 hover:bg-[#ebe8e8] hover:border-crimson/40 hover:shadow-[0_12px_35px_rgba(255,0,60,0.15)] transition-all duration-500 flex flex-col gap-3">
      <span className="text-xs font-mono text-obsidian/70 uppercase tracking-wider group-hover:text-obsidian/90 transition-colors duration-300">
        {blog.author} • {blog.readTime}
      </span>
      <h3 className="text-xl font-serif font-bold text-obsidian leading-tight group-hover:text-crimson transition-colors duration-300">
        {blog.title}
      </h3>
      <p className="text-sm text-obsidian/80 line-clamp-2 leading-relaxed group-hover:text-obsidian transition-colors duration-300">
        {blog.excerpt}
      </p>
    </article>
  )
}

export default function TrendingMarquee() {
  return (
    <section id="trending" className="w-full bg-obsidian pt-12 pb-6 overflow-hidden relative z-10 border-y border-chrome/10 flex flex-col gap-6 scroll-mt-16">
      {/* Row 1: Forward Marquee */}
      <div className="animate-marquee flex gap-6 w-max" style={{ animationDuration: '32s' }}>
        {duplicatedRow1.map((blog, index) => (
          <BlogCard key={`r1-${index}`} blog={blog} />
        ))}
      </div>

      {/* Row 2: Staggered Reverse Marquee */}
      <div className="animate-marquee-reverse flex gap-6 w-max" style={{ animationDuration: '36s' }}>
        {duplicatedRow2.map((blog, index) => (
          <BlogCard key={`r2-${index}`} blog={blog} />
        ))}
      </div>
    </section>
  )
}
