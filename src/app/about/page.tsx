export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">About Me</h1>
        <p className="text-muted-foreground">
          Welcome to my personal blog. I write about topics that interest me.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel
          bibendum bibendum, velit velit bibendum velit, vel bibendum velit vel bibendum
          velit. Sed euismod, velit vel bibendum bibendum, velit velit bibendum velit, vel
          bibendum velit vel bibendum velit.
        </p>

        <h2>My Background</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel
          bibendum bibendum, velit velit bibendum velit, vel bibendum velit vel bibendum
          velit. Sed euismod, velit vel bibendum bibendum, velit velit bibendum velit, vel
          bibendum velit vel bibendum velit.
        </p>

        <h2>My Interests</h2>
        <ul>
          <li>Web Development</li>
          <li>Software Architecture</li>
          <li>User Experience Design</li>
          <li>Writing and Blogging</li>
        </ul>

        <h2>Contact Me</h2>
        <p>
          Feel free to reach out to me at <a href="mailto:example@example.com">example@example.com</a> or
          connect with me on social media.
        </p>
      </div>
    </div>
  );
}
