import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-32">

      {/* HERO */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Dhairya Singhal
        </h1>

        <p className="text-muted text-lg">
          Business Analyst | Data & Strategy | Digital Transformation
        </p>

        <p className="max-w-2xl mx-auto text-muted">
          Turning complex data into clear insights that support leadership decisions at scale.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/resume.pdf"
            target="_blank"
            className="bg-accent px-6 py-3 rounded-md font-medium"
          >
            Download Resume
          </a>

          <a
            href="#projects"
            className="border border-white/20 px-6 py-3 rounded-md"
          >
            View Projects
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="text-muted">
          I’m a Business Analyst with experience in analytics, dashboards, and
          process optimization across education and startup environments.
        </p>
      </section>

      {/* EXPERIENCE */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Experience</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="font-semibold">Beedie Executive Education</h3>
            <p className="text-muted text-sm">Junior Business Analyst (Co-op)</p>
            <ul className="list-disc list-inside text-muted mt-3">
              <li>Built KPI dashboards for leadership</li>
              <li>Analyzed enrolment & revenue data</li>
              <li>Supported CRM and reporting workflows</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="font-semibold">ProveIt</h3>
            <p className="text-muted text-sm">Chief Project Manager</p>
            <ul className="list-disc list-inside text-muted mt-3">
              <li>Led data-driven product initiatives</li>
              <li>Worked with analytics & operations teams</li>
              <li>Drove strategic reporting decisions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Projects</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["dashboard1.png", "dashboard2.png", "dashboard3.png"].map((img, i) => (
            <div key={i} className="bg-card p-4 rounded-lg space-y-3">
              <Image
                src={`/${img}`}
                alt="Dashboard"
                width={400}
                height={250}
                className="rounded-md"
              />
              <p className="text-sm text-muted">
                Interactive dashboard delivering actionable insights.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-muted">
          <span>Power BI</span>
          <span>Tableau</span>
          <span>Python</span>
          <span>Excel</span>
          <span>SQL</span>
          <span>Salesforce</span>
        </div>
      </section>

      {/* CONTACT */}
      <section className="text-center space-y-4 pb-20">
        <h2 className="text-2xl font-semibold">Contact</h2>

        <p className="text-muted">
          Open to Business Analyst and Strategy roles.
        </p>

        <div className="flex justify-center gap-6 text-accent">
          <a href="mailto:your@email.com">Email</a>
          <a href="https://linkedin.com">LinkedIn</a>
        </div>
      </section>

    </div>
  );
}
