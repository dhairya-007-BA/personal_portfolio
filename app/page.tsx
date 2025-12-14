export default function Home() {
  return (
    <main className="min-h-screen px-6 py-24">
      {/* HERO */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Dhairya Singhal</h1>

        <p className="text-lg text-gray-500">
          Business Analyst · Data & Strategy · Digital Transformation
        </p>

        <p className="max-w-2xl mx-auto text-gray-600">
          Turning complex data into clear insights that support leadership
          decisions at scale.
        </p>
      </section>
    </main>
  );
}


      {/* HERO */}
      <section className="text-center pt-24 space-y-6">
  <h1 className="text-5xl font-bold tracking-tight">
    Dhairya Singhal
  </h1>

  <p className="text-muted text-lg">
    Business Analyst · Data & Strategy · Digital Transformation
  </p>

  <p className="max-w-2xl mx-auto text-muted">
    Turning complex data into clear insights that support leadership decisions at scale.
  </p>

  <div className="flex justify-center gap-4 pt-6">
    <a
      href="/resume.pdf"
      className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
    >
      Download Resume
    </a>

    <a
      href="#projects"
      className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/5 transition"
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
      <section id="experience" className="space-y-12">
  <h2 className="text-3xl font-semibold text-center">
    Experience
  </h2>

  <div className="space-y-8">

    <div className="bg-surface p-8 rounded-xl">
      <h3 className="text-xl font-semibold">
        Junior Business Analyst
      </h3>
      <p className="text-accent">
        Beedie Executive Education · Simon Fraser University
      </p>
      <ul className="mt-4 space-y-2 text-muted list-disc list-inside">
        <li>Built KPI dashboards supporting executive decision-making</li>
        <li>Analyzed enrolment and revenue trends across 10+ programs</li>
        <li>Audited and cleaned 30,000+ Salesforce records</li>
      </ul>
    </div>

    <div className="bg-surface p-8 rounded-xl">
      <h3 className="text-xl font-semibold">
        Chief Project Manager
      </h3>
      <p className="text-accent">Provelt</p>
      <ul className="mt-4 space-y-2 text-muted list-disc list-inside">
        <li>Led cross-functional teams delivering strategic initiatives</li>
        <li>Implemented agile workflows improving delivery efficiency</li>
        <li>Aligned analytics outputs with stakeholder needs</li>
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
      <section id="skills" className="space-y-12">
  <h2 className="text-3xl font-semibold text-center">
    Skills
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

    <div className="bg-surface p-6 rounded-xl">
      <h3 className="font-semibold mb-4">Analytics & BI</h3>
      <ul className="text-muted space-y-2">
        <li>Power BI</li>
        <li>Tableau</li>
        <li>Excel (Advanced)</li>
        <li>SQL</li>
      </ul>
    </div>

    <div className="bg-surface p-6 rounded-xl">
      <h3 className="font-semibold mb-4">Business & Strategy</h3>
      <ul className="text-muted space-y-2">
        <li>Business Analysis</li>
        <li>KPI Development</li>
        <li>Process Optimization</li>
        <li>Stakeholder Management</li>
      </ul>
    </div>

    <div className="bg-surface p-6 rounded-xl">
      <h3 className="font-semibold mb-4">Technical Tools</h3>
      <ul className="text-muted space-y-2">
        <li>Python</li>
        <li>Salesforce</li>
        <li>JIRA</li>
        <li>Data Visualization</li>
      </ul>
    </div>

  </div>
</section>

{/* CONTACT */}
<section id="contact" className="text-center space-y-6 pb-24">
  <h2 className="text-3xl font-semibold">Contact</h2>
  <p className="text-muted">
    Open to Business Analyst and Strategy roles.
  </p>

  <div className="flex justify-center gap-6 text-accent">
    <a href="mailto:dhairyasinghal403@gmail.com">Email</a>
    <a href="https://linkedin.com/in/dhairya004">LinkedIn</a>
  </div>
</section>
