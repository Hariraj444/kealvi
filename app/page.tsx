import QuestionsList from "./questions-list";
import { getDashboardStats, getQuestionsPage } from "@/lib/questions";

// Render on every request (don't cache/prerender) so new questions show up.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

// Server component — runs only on the server, awaits the data, renders to HTML.
export default async function Page() {
  const stats = await getDashboardStats();
  const { questions, hasMore } = await getQuestionsPage(0, PAGE_SIZE);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-medium">Live Q&amp;A</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-gray-50 p-4 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Questions
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.questions}
          </p>
        </div>
        <div className="rounded-lg border bg-gray-50 p-4 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Votes
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.votes}
          </p>
        </div>
        <div className="rounded-lg border bg-gray-50 p-4 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Polls
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.polls}
          </p>
        </div>
      </div>

      <QuestionsList initialQuestions={questions} initialHasMore={hasMore} />
    </main>
  );
}
