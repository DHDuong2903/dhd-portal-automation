export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Portal Automation
      </h1>
      <p className="mt-2 max-w-prose text-zinc-600 dark:text-zinc-400">
        Import leads from CSV/Excel, validate them, and create them in your CRM —
        with per-record results you can verify.
      </p>
    </div>
  );
}
