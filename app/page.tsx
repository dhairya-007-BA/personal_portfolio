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
<section id="projects" className="space-y-12">
  <h2 className="text-3xl font-semibold text-center">
    Featured Projects
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {/* Project 1 */}
    <div className="bg-surface p-6 rounded-xl space-y-4 hover:translate-y-[-4px] transition">
      <h3 className="text-xl font-semibold">
        Toronto Budget vs Actuals Dashboard
      </h3>

      <p className="text-muted text-sm leading-relaxed">
        Built a comprehensive Power BI dashboard analyzing city budget
        allocations and spending patterns. Cleaned and modeled 5,000+
        budget records to track spending across 10+ major city programs,
        uncovering underspending trends and budget concentration risks.
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Power BI</span>
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Excel</span>
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Public Sector Analytics</span>
      </div>
    </div>

    {/* Project 2 */}
    <div className="bg-surface p-6 rounded-xl space-y-4 hover:translate-y-[-4px] transition">
      <h3 className="text-xl font-semibold">
        Operational Delay & Market Analytics
      </h3>

      <p className="text-muted text-sm leading-relaxed">
        Developed an end-to-end analytics solution for aviation and
        hospitality datasets. Cleaned and merged 10,000+ flight and
        Airbnb records using Python, then built Tableau dashboards
        analyzing delay patterns by airport, carrier, and season to
        support pricing and capacity planning decisions.
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Python</span>
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Tableau</span>
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Statistical Analysis</span>
      </div>
    </div>

    {/* Project 3 */}
    <div className="bg-surface p-6 rounded-xl space-y-4 hover:translate-y-[-4px] transition">
      <h3 className="text-xl font-semibold">
        Salesforce Data Quality Initiative
      </h3>

      <p className="text-muted text-sm leading-relaxed">
        Led a Salesforce data quality improvement initiative for
        Executive Education programs. Audited and cleansed 30,000+
        CRM records, implemented validation rules and standardization
        processes, and improved reporting accuracy by 40% for
        executive-level decision-making.
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Salesforce</span>
        <span className="text-xs px-3 py-1 bg-bg rounded-full">CRM</span>
        <span className="text-xs px-3 py-1 bg-bg rounded-full">Data Quality</span>
      </div>
    </div>

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
