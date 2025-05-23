export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">About Me</h1>
        <p className="text-muted-foreground">
          Welcome to Webalkoon. This is a simple, personal blog app where you
          can read and share your thoughts and ideas about web development.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert">
        <p>
          I'm a web developer with a passion for building web applications. I
          love to code and learn new things. Currently, I'm working as a
          Software Engineer at{" "}
          <a href="https://www.ileafsolutions.com">iLeaf Solutions</a>.
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
          Feel free to reach out to me at{" "}
          <a href="mailto:abdulsalimplr@gmail.com">abdulsalimplr@gmail.com</a>{" "}
          or connect with me on social media.
        </p>
      </div>
    </div>
  );
}
